# Westside Baptist Academy — Website

Public website for Westside Baptist Academy, Katy, TX. Static site built with [Eleventy](https://www.11ty.dev/), hosted on Azure Static Web Apps (Free plan), deployed by GitHub Actions.

This site is public, static, and has no database.

---

## Why static

No database, no plugins, no admin login, no server to patch. There is nothing here to compromise — which matters, because the WordPress site this replaces was found carrying injected pharmaceutical spam in August 2026.

Hosting cost is $0 on the Azure Static Web Apps Free plan (100 GB bandwidth/month, 250 MB app size, free SSL, 2 custom domains). The only recurring cost is the domain registration.

---

## Running locally

```bash
npm install
npm start        # http://localhost:8080, live reload
npm run build    # builds to _site/
```

Node 20 or newer.

---

## Project layout

```
src/
  _data/           Site content as JSON — edit these, not the templates
    site.json      Name, address, phone, service times, school day
    nav.json       Navigation structure
    faculty.json   Faculty roster
    forms.json     Forms & documents list
  _includes/
    layouts/       base.njk (shell), page.njk (standard interior page)
    partials/      header.njk, footer.njk
  assets/          CSS, JS, images — copied through as-is
  files/           PDFs (handbook, applications, supply lists) go here
  *.njk / *.md     One file per page
api/               Azure Function handling the tour-request form
_site/             Build output (git-ignored)
staticwebapp.config.json   Routing, security headers, 404 handling
```

## Editing content

**Text on a page** — edit the `.md` or `.njk` file for that page under `src/`. Markdown pages are plain text with a small header block at the top.

**Phone, address, service times** — `src/_data/site.json`. Changes there update every page at once.

**Faculty** — `src/_data/faculty.json`. Add `bio` text and drop headshots into `src/assets/img/faculty/`.

**Forms** — put the PDF in `src/files/`, then set that item's `file` value in `src/_data/forms.json`.

**Logo** — two files, both set in `src/_data/site.json`:

- `logo` → `logo-160.png`, the header mark
- `logoLarge` → `logo-anniversary-640.png`, the homepage anniversary band

Both are the 20th Anniversary emblem with the background removed, so they sit on any light surface. The emblem's black outlines disappear on dark grounds, which is why the footer carries the school name as type rather than the mark. If a knockout (white) version of the logo is ever produced, the footer mark could come back.

To swap in a different file: drop it into `src/assets/img/` and point `logo` at it. The header sizes it by height with automatic width, so any aspect ratio fits without template changes.

The favicon (`src/assets/img/favicon.svg`) is a simple red tile with a white W. That is deliberate — the full emblem is unreadable at 16 pixels.

Push to `main` and the site rebuilds and redeploys automatically.

### Closing the school for a day

`src/_data/alert.json` controls the red banner that appears above the header on every page.

```json
{
  "active": true,
  "title": "School is closed today",
  "message": "Westside Baptist Academy is closed Tuesday, January 20 due to weather. Classes resume Wednesday.",
  "expires": "2027-01-21T12:00:00-06:00"
}
```

Set `active` to `true`, write the message, commit. The banner is live about two minutes later. Set it back to `false` to take it down.

`expires` is optional but recommended. Give it a date and time and the banner hides itself once that moment passes — even if nobody gets round to editing the file — so a Monday closure notice does not still be sitting there on Thursday. Use `-06:00` for Central Standard Time, `-05:00` during daylight saving. Leave it empty and the banner stays until someone turns it off.

Keep the message to two sentences: what is closed, which day, and when it reopens. The handbook tells parents to check the website, so this is the thing that makes that instruction true.

### The "Needs content" boxes

Yellow boxes marked **Needs content** are visible on the live site on purpose — they are honest placeholders rather than blank space pretending to be finished. Each one names what is missing and where it goes. Delete the `{% raw %}{% todo %}...{% endtodo %}{% endraw %}` block once the real content is in.

`CONTENT-CHECKLIST.md` lists every one of them.

---

## Deploying to Azure

### 1. Create the GitHub repository

```bash
git init
git add .
git commit -m "Initial site"
git branch -M main
git remote add origin https://github.com/rhorn-westside/wba-website.git
git push -u origin main
```

### 2. Create the Static Web App

Azure portal → **Create a resource** → **Static Web App**.

| Field | Value |
|---|---|
| Resource group | `wbagradebook` (or a new `wbawebsite` group) |
| Name | `wba-website` |
| Plan type | **Free** |
| Region | Central US |
| Source | GitHub → `rhorn-westside/wba-website`, branch `main` |
| Build presets | **Custom** |
| App location | `_site` |
| Api location | `api` |
| Output location | *(leave empty)* |

Azure commits its own workflow file on creation. **Delete that file** and keep `.github/workflows/azure-static-web-apps.yml` from this repo — it runs the Eleventy build first and sets `skip_app_build: true`, which Azure's generated version does not.

Azure adds the deployment secret `AZURE_STATIC_WEB_APPS_API_TOKEN` to the repo automatically.

### 3. Custom domain

Static Web App → **Custom domains** → **Add**.

- `www.westsidebaptistacademy.org` — validate with a CNAME to the app's `*.azurestaticapps.net` hostname
- Apex `westsidebaptistacademy.org` — use ALIAS/ANAME if the registrar supports it, or TXT validation

SSL certificates are issued and renewed automatically. The Free plan allows 2 custom domains.

Then update `site.url` in `src/_data/site.json` so the sitemap points at the live domain.

### 4. Tour form email (optional but recommended)

The tour request form posts to `/api/inquiry`, which emails the office via Microsoft Graph using the school's Microsoft 365 tenant.

Add these under Static Web App → **Configuration** → **Application settings**:

| Setting | Value |
|---|---|
| `GRAPH_TENANT_ID` | Entra tenant ID |
| `GRAPH_CLIENT_ID` | App registration (client) ID |
| `GRAPH_CLIENT_SECRET` | Client secret |
| `INQUIRY_FROM` | Sending mailbox, e.g. `noreply@mywestside.org` |
| `INQUIRY_TO` | Where inquiries land, e.g. `principal@mywestside.org` |

The app registration needs the Microsoft Graph **application** permission `Mail.Send`, with admin consent granted. Give this its own registration rather than reusing another one — it only needs to send mail.

Until these are set, the form returns an error, the page tells the visitor to call the office, and the full submission is written to the function log so no inquiry is silently lost.

---

## Publishing weekly homework schedules

`/families/homework/` currently explains the homework policy. If the actual weekly sheets are published there later, the design worth keeping in mind is **publish files, don't query a database**.

Whatever system produces the schedules should write each grade's sheet out as a static file — committed to this repo, or dropped in a storage container this site reads at build time. A public page that queries a database on every parent visit is slower, costs compute, and goes down when the database does. Static files have none of those problems, and last week's sheet stays readable regardless.

---

## Costs

| Item | Cost |
|---|---|
| Azure Static Web Apps (Free) | $0 |
| SSL certificates | $0 |
| GitHub Actions (public repo) | $0 |
| Domain registration | ~$15/year |

Free plan limits worth knowing: 100 GB bandwidth per month (roughly 50,000 page views), 250 MB app size, 15,000 files, 2 custom domains, no SLA. Compress photographs before committing them — an unoptimized gallery is the only realistic way to hit the size cap.
