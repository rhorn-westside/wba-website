# Annual Rollover Checklist

Everything that changes when a new school year starts. Work down the list in July.

Most of it can be done at `/admin` without touching code.

---

## 1. Book and supply lists

**Forms & Documents → Forms & Documents page**

- [ ] Replace all thirteen grade book lists with the new year's
- [ ] Replace the Elementary Supply List
- [ ] Replace the Jr. & Sr. High Supply List
- [ ] Update the section headings to the new year (e.g. "Book & Material Lists, 2027–2028")

Name files with the year — `2027-2028-elementary-supply-list.pdf` — so old and new are never confused.

---

## 2. Enrollment documents

**Forms & Documents → Enrollment**

- [ ] New Student Application
- [ ] Financial Information Page
- [ ] Parent Agreements
- [ ] Church Affiliation Confirmation Form
- [ ] Student Church Attendance Form
- [ ] Student Handbook

---

## 3. Tuition and fees

**Pages → Tuition & Fees**

- [ ] Tuition table — both grade bands, all three child rates
- [ ] Application & Enrollment Fee
- [ ] All the individual fees: senior, K5 graduation, placement testing, achievement testing, athletics, homeschool participation
- [ ] Late payment charges

Cross-check every figure against the new Financial Information Page. These two disagreed with the handbook in 2026 — the late charge and the account-current date.

---

## 4. Calendar

**Pages → School Calendar**

- [ ] The dates families are asked to commit to
- [ ] Break dates
- [ ] Quarter dates if published

**Check the day names against a real calendar.** Four dates in the 2026–2027 handbook named a weekday that did not match the date, carried over from an earlier year. Publish a day name only where it has been verified.

---

## 5. Staff

**Faculty & Staff**

- [ ] Remove anyone who has left
- [ ] Add new teachers with their grade or subject
- [ ] Update roles that changed
- [ ] Add photographs for anyone missing one

---

## 6. Year references in the text

Search the site for the old school year and update anything left:

- [ ] Homepage
- [ ] Admissions pages
- [ ] Tour request form — the school-year dropdown on **Schedule a Tour** is in `src/admissions/visit.njk` and needs editing in code

---

## 7. Anything year-specific

- [ ] Summer reading lists
- [ ] Athletics registration forms and season dates
- [ ] Fine arts competition dates and location
- [ ] Uniform stock numbers, if French Toast changed them

---

## 8. Check it over

- [ ] Click every document link on the Forms page and confirm each opens the **new** year's file
- [ ] Read the tuition page against the financial sheet, line by line
- [ ] Open the site on a phone
- [ ] Confirm the closure banner is switched **off**

---

## Worth doing while you're in there

- [ ] Fresh photographs — nothing dates a school site faster than students who have graduated
- [ ] Re-read the handbook-derived pages (attendance, dress code, conduct, grading) against the new handbook, since policies drift year to year
- [ ] **Check the tour form still works.** Submit a test request and confirm it arrives. The Microsoft Graph client secret behind it expires on a date set when it was created — usually two years out. When it expires the form stops sending, and the only visible sign is a visitor being told to phone instead. Note the expiry date somewhere you will actually look; `MAINTENANCE.md` explains how to issue a new secret.
