// Which copy of the site is being built.
//
// The GitHub Actions workflow sets SITE_ENV=preview when it builds the
// `drafts` branch. That build goes to the private preview address, not the
// live site, and shows a ribbon saying so — because the single most likely
// mistake with a preview setup is someone editing happily for an hour and
// assuming parents can see it.
export default {
  preview: process.env.SITE_ENV === "preview",
};
