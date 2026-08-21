# Content Checklist

Every item below appears on the live site as a yellow **Needs content** box. They are visible on purpose — an honest gap beats a blank space that looks finished.

Delete the `{% raw %}{% todo %}...{% endtodo %}{% endraw %}` block in the source file once the real content is in.

**Status: 18 remaining, down from 27.** The 2026–2027 student handbook filled the rest.

---

## Must be done before launch

| What | Page | Source file | Why it blocks launch |
|---|---|---|---|
| **Statement of Faith — verify, no longer missing** | /about/beliefs/ | `src/about/beliefs.md` | All fifteen articles are published verbatim. Six apparent typographic slips were corrected and are listed in a box on the page for Pastor Butts to confirm — including two substantive reference fixes (Heb. 1:18 → 1:8, and Matthew 18:16-20 → 28:16-20 for the Great Commission). |
| **Tuition — verify, no longer missing** | /admissions/tuition/ | `src/admissions/tuition.md` | Figures are now published from the school's 2026–2027 Financial Information Page. Two need reconciling: the application fee ($140 non-refundable in the handbook vs. a $215 Application & Enrollment Fee on the financial page) and the late charge ($20 handbook vs. $25 financial page — the site uses $25). |
| **Form PDFs** | /families/forms/ | `src/files/` + `src/_data/forms.json` | The list of 13 documents is right, but no files are attached. Every link is dead until they are uploaded. |

---

## Check this — a discrepancy in the handbook

Four dates in the handbook's *Important Dates Commitment* name a weekday that does not match the 2026–2027 calendar:

| Date | Handbook says | Actually falls on |
|---|---|---|
| December 22 — Christmas Program | Friday | **Tuesday** |
| December 23 — Christmas break begins | Monday | **Wednesday** |
| January 5 — classes resume | Monday | **Tuesday** |
| May 11 — Spring Program | Monday | **Tuesday** |

The other dates check out. These four look carried over from an earlier year's handbook. Worth correcting in the handbook itself as well as on the site — parents plan around these.

Flagged on `/families/calendar/`; the site prints day names only where they are confirmed correct.

---

## High value, straightforward

| What | Page | Notes |
|---|---|---|
| Faculty photos and bios | /about/faculty/ | Still the single highest-return item on the whole site. One afternoon, same background, same crop, all ten staff. Photos → `src/assets/img/faculty/`, bios → `src/_data/faculty.json`. |
| French Toast stock numbers | /student-life/dress-code/ | The handbook says uniforms are ordered "using only the stock numbers posted on the WBA website" — so those numbers need to be here, as a table with a direct link to the Westside section of the French Toast site. Most-asked-for item on any uniform page. |
| Full year calendar | /families/calendar/ | The handbook's commitment dates and breaks are published. Still missing: first and last day, quarter start and end dates, holidays, early releases, testing weeks, graduation. |
| Course catalog | /academics/secondary/ | Graduation credits are now published from the handbook. A catalog with a paragraph per course is what's still missing. |
| Curriculum detail | /academics/ | Publisher and edition per subject per grade. Transfer and former-homeschool families read this closely. |
| Chapel day and time | /student-life/ | And whether parents and grandparents may attend. They will if invited. |
| Athletics | /student-life/ | Sports offered, seasons, coaches, home game location. |
| Summer reading | /student-life/ | Lists by grade. |
| Online giving | /give/ | Link the existing platform; state whether Academy gifts are handled separately from church gifts. Tax-deductibility is now stated from the handbook. |
| Giving designations | /give/ | Donors give more readily to a named need than a general fund. |
| FAQ additions | /admissions/ | Church attendance, kindergarten age, placement testing and payment terms are now answered. Still worth adding: before-and-after care, carline timing, current class sizes. |
| Lunch menus and carline | /families/ | Lunch policy is in from the handbook; the snack shop menu and carline procedure are not. |
| Closure banner | /families/ | The handbook tells parents to check the website when school closes. Build a banner that can be switched on from one place so that instruction is actually true. |
| Map and campus photo | /contact/ | A picture of the door a visitor should walk through removes real friction on tour day. |
| Weekly homework schedules | /families/homework/ | The homework policy is published. Posting the actual weekly sheets needs a way for staff to upload them each week. |

---

## Filled in from the handbook

For reference, this is what the 2026–2027 handbook supplied:

- **Purpose, blueprint and the eight program goals** — /about/, /about/beliefs/
- **Church attendance requirement**, in full — /about/beliefs/
- **Grading scale** (100–90 A, 89–80 B, 79–70 C, 69–60 D) — /academics/grading/
- **Promotion policy**, Bible pass requirement, summer school — /academics/grading/
- **Weekly folders, progress reports at 4½ weeks, required nine-week conference** — /academics/grading/, /families/
- **Graduation requirements** — 26 recommended credits by subject, 22 minimum, six-month enrolment rule, eight-credit rule — /academics/secondary/
- **Transfer credit, dual credit policy, ACT/SAT** — /academics/secondary/
- **Kindergarten entry age** (five by October 1) — /academics/elementary/, /admissions/
- **Full enrollment procedure** — records, health, testimony, testing, English, consent forms, orientation, age limit — /admissions/apply/
- **Nondiscriminatory policy**, full text — /admissions/apply/
- **Payment terms** — ten payments, 15th of the month, August–May; family discount; $140 application; late charges and penalties; returned checks; transcripts; withdrawal; tax treatment — /admissions/tuition/
- **Attendance policy** — a new page at /families/attendance/
- **School closure procedure** (Schoolcast → Facebook and website → teacher → Mr. Horn) — /families/, /families/calendar/
- **School day times** including office hours, early arrivals, 3:25 pickup — throughout
- **Homework policy** and the AI-use policy — /families/homework/
- **Dress code**, general, boys and girls — a new page at /student-life/dress-code/
- **Standard of conduct and discipline system** — a new page at /student-life/conduct/
- **Fine arts requirements**, programs, lunch, birthdays, trips, closed campus — /student-life/
- **Important dates and breaks** — /families/calendar/

---

## Separate from this project, but urgent

The WordPress site at mywestside.org is carrying injected pharmaceutical spam with live outbound links to pharmacy sites, confirmed on `/wba/admissions/`, `/wba/forms-documents/`, `/wba/student-handbook/` and `/about/beliefs/`.

That site needs cleaning whether or not this one launches:

1. Change WordPress admin and hosting passwords
2. Check for unrecognized admin users
3. Have the host scan and restore from a pre-infection backup
4. Register the domain in Google Search Console and request review once clean

Whoever injected the spam had write access. Assume any credentials on that install are compromised.
