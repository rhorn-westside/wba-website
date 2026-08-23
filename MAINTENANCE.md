# Maintenance

For whoever looks after this site technically. If you are new to it, read this first.

---

## What this is

A static website. Markdown and JSON files in a Git repository are compiled into plain HTML by [Eleventy](https://www.11ty.dev/), then served by Azure Static Web Apps.

There is **no database, no server-side code, no admin login on the server, and no plugins**. Nothing on the hosting side executes. This matters: the site it replaced was a WordPress install that got compromised and served injected pharmaceutical spam for months. There is nothing here of that shape to compromise.

---

## Where everything lives

| Thing | Where |
|---|---|
| Source code | GitHub — `rhorn-westside/wba-website` |
| Hosting | Azure Static Web Apps — resource group `wba-website`, Free plan |
| Live URL | `lively-meadow-02dd32510.7.azurestaticapps.net` (plus any custom domain) |
| Deployment | GitHub Actions, on every push to `main` |
| Content editor | [app.pagescms.org](https://app.pagescms.org) — Pages CMS, configured by `.pages.yml` |
| Church website | mywestside.org — **separate**, WordPress, not managed here |

**Accounts needed to maintain this:** GitHub (repo access) and Azure (the subscription holding the Static Web App). Nothing else.

---

## Branches, and how a change reaches the live site

There are two long-lived branches.

| Branch | Builds to | Who pushes to it |
|---|---|---|
| `main` | the live site | you, for code; the Publish workflow, for content |
| `drafts` | a private preview environment | the office, via Pages CMS |

**Content path.** The office edits `drafts` in Pages CMS. Each save triggers `azure-static-web-apps.yml`, which builds with `SITE_ENV=preview` and deploys to the Azure named environment `preview`. That build carries a ribbon on every page and a `noindex` meta tag. When the office runs the **Publish to the live site** workflow, it merges `drafts` into `main`, builds, runs the link and CMS-config checks, pushes `main`, deploys to production, and fast-forwards `drafts` back to `main`.

**Code path.** You push to `main` directly. It deploys, and a final step fast-forwards `drafts` so the office previews against current templates. If `drafts` has unpublished content edits that push cannot fast-forward, the step logs a message and moves on — the next Publish merges the two properly.

Two to three minutes end to end. Watch it under the repo's **Actions** tab.

### Why Publish deploys instead of just merging

A push made with `GITHUB_TOKEN` does not trigger other workflows. If `publish.yml` only merged and pushed, the ordinary deploy would never fire and the button would look broken. So it does the production deploy itself.

### Why the checks run before the push

`publish.yml` builds and validates the merge result *before* `git push origin main`. A change that breaks a link fails the workflow with the live site untouched, rather than half-published.

### Look & Feel (the theme system)

`src/_data/theme.json` holds eight settings. `scripts/theme.mjs` expands them into the full set of CSS custom properties — deriving `--red-dark`, `--red-tint`, `--ink-soft`, `--ink-faint`, `--paper-alt`, `--rule` and `--white` from the three chosen colours — and `src/_data/themeCss.js` renders that block into every page's `<head>`, after the stylesheet link so it overrides the defaults still declared in `site.css`.

Those defaults are the fallback: delete `theme.json` and the site builds unchanged.

`scripts/theme.mjs` detects a dark page background and inverts the derivation direction, so a dark scheme lightens its supporting tones instead of darkening them into invisibility.

`scripts/check-contrast.mjs` enforces 4.5:1 on three pairings and runs in both `checks.yml` and `publish.yml`. The Eleventy build only *warns* — deliberately, so a bad scheme still renders on the preview where the office can see what they did, while remaining unpublishable.

To add a control: add the key to `theme.json`, handle it in `buildTheme()`, declare it in `.pages.yml` under `Look & Feel`, and make sure the CSS consumes the variable with a sensible fallback (`var(--base-size, 1.0625rem)`). `check-cms-config.mjs` will fail the build if the config and the file disagree.

### The tour form

`api/src/functions/inquiry.js` is an Azure Function that emails the office via Microsoft Graph, using client-credentials auth against the school's Microsoft 365 tenant. `api_location: "api"` in both deploy workflows is the switch that ships it.

Five application settings, in the Azure portal under **Static Web App → Settings → Environment variables**:

| Setting | Value |
|---|---|
| `GRAPH_TENANT_ID` | Entra tenant (directory) ID |
| `GRAPH_CLIENT_ID` | App registration client ID |
| `GRAPH_CLIENT_SECRET` | Secret value for that registration |
| `INQUIRY_FROM` | Mailbox that sends |
| `INQUIRY_TO` | Where inquiries land (comma-separated for several) |

The app registration needs the Graph **application** permission `Mail.Send` with admin consent.

**Scope it.** `Mail.Send` as an application permission lets the app send as *any* mailbox in the tenant. Restrict it to the one sending mailbox with an ApplicationAccessPolicy in Exchange Online PowerShell:

```powershell
New-ApplicationAccessPolicy -AppId <client-id> `
  -PolicyScopeGroupId <sending-mailbox@domain> `
  -AccessRight RestrictAccess `
  -Description "WBA website tour form"
```

**The secret expires.** When it does, `getGraphToken` throws, the function returns 502, and the visitor is told to phone. Nothing alerts anyone. The submission is still written to the log stream, so leads survive, but the failure is silent — hence the item in `ROLLOVER.md`.

Failure behaviour by design: missing settings → 503; Graph failure → 502; both log the full submission via `context.error` so nothing is lost while the plumbing is broken.

### Turning the preview scheme off

Delete `publish.yml`, drop `drafts` from the `push` trigger in `azure-static-web-apps.yml`, delete the `drafts` branch, and point the office's Pages CMS bookmark back at `main`. The `env.preview` flag then evaluates false everywhere and the ribbon never renders. Nothing else depends on it.

---

## Working locally

```bash
npm install
npm start        # http://localhost:8080, reloads as you edit
npm run build    # compiles to _site/
```

Node 20 or newer.

---

## Project layout

```
src/
  _data/           Content as JSON — edit these, not the templates
    site.json      Name, address, phone, service times, school day, logo paths
    nav.json       Navigation structure
    faculty.json   Staff list
    forms.json     Forms & Documents page
    alert.json     Closure banner
  _includes/
    layouts/       base.njk (page shell), page.njk (standard interior page)
    partials/      header, footer, alert banner
  assets/          CSS, JS, logo — copied through as-is
  files/           PDFs
  *.njk / *.md     One file per page
api/               Tour-form Azure Function — NOT currently deployed
scripts/           CI checks (links, CMS config)
.pages.yml         What editors see in Pages CMS
staticwebapp.config.json   Routing, security headers, 404 handling
```

---

## Things that will surprise you

**The workflow file references a secret whose name contains the app's hostname** — `AZURE_STATIC_WEB_APPS_API_TOKEN_LIVELY_MEADOW_02DD32510`. Azure generates that name when the app is created. If the Static Web App is ever recreated, the name changes and the workflow must be updated to match, or every deploy fails at the final step with an empty token.

**Do not let Azure add its own workflow file.** If the repo is ever reconnected in the Azure portal, Azure commits a second workflow that tries to build the site with Oryx, which does not understand Eleventy. Delete it and keep `.github/workflows/azure-static-web-apps.yml`.

**The tour form's Azure Function is not deployed.** `api_location` is empty in the workflow. Until the Microsoft Graph settings exist the function has nothing to do, and leaving it out removes a way for the deploy to fail. To enable it: set `api_location: "api"`, add the five app settings listed in `README.md`, and push.

**Two data files are wrapped in an object** — `forms.json` is `{ groups: [...] }` and `faculty.json` is `{ people: [...] }`, not bare arrays. CMSes expect an object at the root of a data file. The templates expect that shape.

**Saving through the CMS rewrites the whole file** from the fields declared in `.pages.yml`. Any key not declared there is lost. That is why `scripts/check-cms-config.mjs` exists and runs on every push — add a key to a data file without adding it to `.pages.yml` and CI fails before an editor can silently delete it.

**The closure banner self-expires in the browser.** The banner is rendered at build time, but `src/assets/js/site.js` hides it once the `expires` timestamp passes. That is why a stale banner disappears without anyone rebuilding.

---

## Common tasks

**Roll back a bad change** — find the commit in GitHub, click **Revert**, merge. Live again in two minutes.

**Restore a deleted file** — it is in the Git history. `git log --diff-filter=D --name-only` finds when it went.

**Add a page** — copy an existing `.md` file in `src/`, change the front matter (`title`, `lede`, `permalink`), add it to `src/_data/nav.json`, and add an entry under `content:` in `.pages.yml` so editors can reach it.

**Change what editors can edit** — `.pages.yml` at the repository root. Adding a field there without adding it to the underlying file (or the reverse) is caught by `scripts/check-cms-config.mjs`, which runs in CI.

**Replace the CMS** — nothing depends on it. Delete `.pages.yml`, uninstall the GitHub App, and the site is unaffected. The content is plain markdown and JSON either way.

**Check nothing is broken before publishing** — open a pull request instead of pushing to `main`. Azure builds it to a temporary preview URL automatically.

---

## Costs

| Item | Cost |
|---|---|
| Azure Static Web Apps (Free plan) | $0 |
| SSL certificates | $0 |
| GitHub Actions (public repo) | $0 |
| Pages CMS | $0 — open source |
| Domain registration | ~$15/year |

Free plan limits: 100 GB bandwidth/month (roughly 50,000 page views), 250 MB app size, 15,000 files, 2 custom domains, no uptime SLA. The site is currently around 1.5 MB. Compress photographs before committing them — an unoptimised gallery is the only realistic way to approach the size cap.

---

## If the site goes down

1. Check the repo's **Actions** tab — a failed deploy leaves the *previous* version live, so a red run does not by itself take the site down
2. Check the Azure portal for the Static Web App's status
3. Check the domain registrar if a custom domain stopped resolving

The last successfully deployed version stays live until a new one succeeds. A broken build cannot take the site off the air.
