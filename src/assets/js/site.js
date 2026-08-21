// Closure banner self-expiry.
//
// The banner is rendered at build time when alert.json has active: true.
// If an "expires" timestamp was given, hide it once that moment has passed —
// so a Monday closure notice disappears on Tuesday morning by itself, without
// waiting for anyone to edit the file and redeploy. A banner left up too long
// does more damage than one that never went up.
(function () {
  var el = document.querySelector(".alert[data-expires]");
  if (!el) return;
  var raw = el.getAttribute("data-expires");
  if (!raw) return;
  var when = Date.parse(raw);
  if (!isNaN(when) && Date.now() > when) {
    el.hidden = true;
  }
})();

// Mobile navigation toggle. Everything else on this site is plain HTML.
(function () {
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("primary-nav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", function () {
    var open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  // Close the menu on Escape, and return focus to the button.
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && nav.classList.contains("is-open")) {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.focus();
    }
  });
})();
