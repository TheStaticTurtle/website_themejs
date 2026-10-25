// Table of contents: marks the entry of the section being read (the last heading that has
// scrolled past the top of the page). Without JavaScript the list is a plain list of links.
(() => {
  const toc = document.querySelector(".toc");
  if (!toc) return;

  const OFFSET = 96; // px from the top of the window at which a heading counts as "reached"

  const entries = [...toc.querySelectorAll("a[href^='#']")]
    .map((link) => ({ item: link.parentElement, heading: document.getElementById(decodeURIComponent(link.hash.slice(1))) }))
    .filter((entry) => entry.heading);
  if (!entries.length) return;

  let current = null;
  const update = () => {
    let active = null;
    for (const entry of entries) {
      if (entry.heading.getBoundingClientRect().top <= OFFSET) active = entry; else break;
    }
    if (active === current) return;
    current?.item.classList.remove("on");
    active?.item.classList.add("on");
    current = active;
  };

  // Clicking an entry scrolls smoothly (unless the reader prefers reduced motion) and keeps the link in the address bar
  const smooth = matchMedia("(prefers-reduced-motion: no-preference)");
  toc.addEventListener("click", (event) => {
    const link = event.target.closest("a[href^='#']");
    const entry = link && entries.find((candidate) => candidate.item === link.parentElement);
    if (!entry) return;
    event.preventDefault();
    entry.heading.scrollIntoView({ behavior: smooth.matches ? "smooth" : "auto", block: "start" });
    history.pushState(null, "", link.hash);
  });

  let queued = false;
  const onScroll = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; update(); });
  };
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", onScroll);
  update();
})();
