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

## How a change reaches the live site

1. Someone edits a file — through Pages CMS, through GitHub's web editor, or locally
2. The change is committed to `main`
3. GitHub Actions runs `npm ci`, then `npm run build` (Eleventy compiles `src/` into `_site/`)
4. The Azure action uploads `_site/`

Two to three minutes end to end. Watch it under the repo's **Actions** tab.

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
