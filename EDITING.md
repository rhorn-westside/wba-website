# Updating the Website

Everything on this page can be done from a web browser. You do not need to install anything, and you cannot break the site by editing text — every change is saved with a history, and anything can be undone.

---

## How it works: edit, look, publish

Nothing you type goes straight onto the real website. There are three steps, and three bookmarks.

| | Bookmark | What it's for |
|---|---|---|
| 1 | **Editor** | Where you type. Changes save to a draft. |
| 2 | **Preview** | A private copy of the site showing your drafts. Parents cannot see it. |
| 3 | **Publish** | The button that puts your drafts onto the real website. |

So the rhythm is: **make your change → look at the preview → press Publish.**

Every page of the preview site has a dark ribbon across the top reading *"Preview copy — parents cannot see this."* If you see that ribbon, you are looking at the draft. If you don't, you are looking at the real website.

> **The mistake everyone makes once.** You edit, you save, you check the real website, and nothing has changed — so you edit it again. Save is not publish. Your work is fine; it's sitting in the draft waiting. Press Publish.

---

## Signing in

All three bookmarks use your GitHub account. Sign in once and the browser remembers you.

If you don't have a GitHub account, the principal can set one up for you and give you access. It's free and takes a minute. You only ever use it to sign in here.

**Getting the three bookmarks the first time.** Ask the principal — he has them written down. The editor bookmark in particular has to point at the **drafts** branch, and getting there by hand is fiddly. If you ever land in the editor and are unsure, look at the top of the screen: it should say **drafts**, not *main*. If it says *main*, you are editing the live site directly — back out and use the bookmark.

---

## What you'll see

Down the left-hand side you'll see these.

| Section | Use it for |
|---|---|
| **School Closings** | The red banner that appears when school is closed |
| **Forms & Documents** | Uploading PDFs — book lists, supply lists, applications |
| **Faculty & Staff** | Adding, removing or updating staff |
| **Look & Feel** | Colours, fonts and text size for the whole site |
| **School Information** | Phone, address, office hours, service times |
| **Pages** | The wording on most pages of the site |
| **Contact Page** | Who to ask, employment, and the Contact page wording |
| **Homepage** | Everything on the front page |
| **Family Resources Page** | The Current Families landing page |
| **How to Apply Page** | The enrollment steps |
| **New Pages** | Creating a page that doesn't exist yet |
| **Navigation Menu** | What appears in the menu across the top |

Your change reaches the **preview** site about two minutes after you press **Save**. It reaches the real website about two minutes after you press **Publish**.

---

## Publishing

1. Open the **Publish** bookmark
2. Press **Run workflow**, then the green **Run workflow** button that appears
3. Wait about two minutes

That's it. A green tick means it's live; a red cross means something was wrong and the real website was left exactly as it was — nothing half-published, nothing broken. If you get a red cross, tell whoever looks after the site technically and carry on; your draft is safe.

Publish as often or as rarely as you like. You can make six changes across a morning and publish them all with one press.

---

## Closing school for a day

1. **School Closings** → **Closure banner**
2. Switch **Show the banner** on
3. Write the headline and message — say what is closed, which day, and when it reopens
4. Set **Take down automatically after** to the morning school reopens
5. **Save**

6. Open the **Publish** bookmark and press **Run workflow**

**A closure banner is the one thing worth publishing straight away** — check the preview if you want, but don't leave it sitting in draft while parents are wondering about tomorrow.

The banner appears across the top of every page. Setting the take-down time matters: it means the notice disappears by itself, so a Monday closure isn't still showing on Thursday.

**The take-down time must be in the future.** If you set a time that has already passed, the banner will not appear at all — the site treats it as already finished. If you turn the banner on and nothing shows up on the website, this is almost certainly why. Check the date and time, or clear the field entirely to leave the banner up until you switch it off.

To take it down early, switch **Show the banner** off and save.

---

## Adding or replacing a document

1. **Forms & Documents** → **Forms & Documents page**
2. Open the section it belongs in — Book Lists, Supply Lists, Enrollment, or Permissions & Athletics
3. To **replace** a document: open it, click the **PDF file** box, upload the new file
4. To **add** one: click **Add Document**, type the name, upload the file
5. **Save**

**A document with no file attached shows as "Coming soon" to parents.** That's deliberate — it lets you list something you don't have yet without a dead link.

When you replace a file, give it a name that says what year it is (`2027-2028-elementary-supply-list.pdf`), so the old one is easy to tell apart.

---

## Adding a teacher

1. **Faculty & Staff** → **Faculty & Staff page**
2. **Add Person**
3. Name (include the title — Mrs., Mr., Miss), role, and which section of the page they belong in
4. **Save**

Drag the handle on the left of each person to reorder them within a section.

---

## Changing wording on a page

1. **Pages** → pick the page
2. Edit the text in the big box
3. **Save**

The editor works like a word processor — bold, headings, lists and links all have buttons. The **Page title** and **Intro line** at the top are the heading and grey sentence beneath it.

You will sometimes see yellow **Needs content** boxes on the live site. Those are notes about something still missing. When you've supplied it, delete the whole yellow box from the page text.

---

## Adding a new page

Two steps: make the page, then put it in the menu so people can find it.

**Make the page**

1. **New Pages** → **Add an entry**
2. Give it a title, an intro line, and the text
3. **Save**

Your page is now live, but nothing links to it yet. Its web address is `/pages/` followed by the title in lowercase with hyphens instead of spaces — a page called **Summer Camp** becomes `/pages/summer-camp/`.

**Put it in the menu**

1. **Navigation Menu**
2. **Add an entry** for a new top-level item, or open an existing one and add a drop-down item beneath it
3. Menu wording is what people see; the web address is the `/pages/summer-camp/` part
4. **Save**

Drag entries to reorder them. Removing something from the menu does not delete the page — it just stops linking to it.

**A word of advice.** A menu with seven items is easy to scan; one with twelve is not. Before adding a top-level item, consider whether the page belongs as a drop-down under one that already exists.

---

## Changing colours, fonts or text size

**Look & Feel** → **Look & Feel**. It changes the whole site at once.

You pick three colours — the brand red, the text colour, and the page background. Everything else is worked out from those: the darker red for buttons you're hovering over, the pale wash behind callouts, the softer grey for captions, the hairlines between sections. That's deliberate. Picking nine colours by hand is how a site ends up looking like nine different sites.

Below the colours are fonts, text size, corner rounding and content width. The font choices all use typefaces already on people's computers, so nothing has to load and the page never flickers as it changes.

**This is the section most worth previewing before you publish.** A wording change is easy to picture in your head; a colour change is not. Save, look at the preview, and only then publish.

**If the colours are too hard to read, publishing will refuse.** You'll get a red cross with a message naming exactly which combination is the problem and what to do about it — usually darkening the text or lightening the background. The live site is left untouched. This only catches genuinely unreadable text, not merely ugly text: nothing stops you making the site orange.

To get back to where you started: brand `#C30D11`, text `#1F1F1F`, page `#FBF9F6`, Classic fonts, serif headings, Normal size, Slightly rounded, Standard width.

---

## Changing the phone number, hours or service times

**School Information** → **Contact details & service times**. One change here updates every page at once.

The phone number appears twice on purpose: once as people read it, once as digits so it can be tapped on a phone. Change both.

---

## What is not editable here

Two pages are not in the editor: **Schedule a Tour** (it is mostly a form) and the wording around the **Forms & Documents** and **Faculty & Staff** pages — though the documents and the people on those pages are both fully editable.

If something on one of those needs changing, ask whoever looks after the site technically.

**A shortcut worth knowing:** on the Homepage, Family Resources, How to Apply and Contact pages, you can type `%PHONE%` or `%EMAIL%` anywhere in the text and the school's real phone number or email address appears there as a working link. That way, if the number ever changes, it only has to be changed once — under School Information.

---

## If you don't see your change

**First: are you looking at the right site, and did you publish?** Nine times out of ten the answer is one of those two. The preview site has a dark ribbon at the top; the real one doesn't. And a change only reaches the real site after you press Publish.

If both of those are right, give it two minutes, then **hard refresh**: hold ⌘ and ⇧ and press R. Your browser keeps a copy of pages it has already loaded, and will happily keep showing you the old one.

If a hard refresh doesn't do it, open the page in a private window. That never uses the stored copy, so what you see there is genuinely what everyone else sees.

Nine times out of ten this is the explanation, not a broken save.

---

## If something looks wrong

Every change is saved with a full history, so nothing is ever really lost. Tell whoever looks after the site technically — they can put back any earlier version in under a minute.
