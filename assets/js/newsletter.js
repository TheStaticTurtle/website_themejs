// Newsletter: sends the subscription form in the background (listmonk public API) and shows the
// result under the form. If the request cannot be made (network, CORS), the form is submitted
// the normal way instead, which opens listmonk's own page in a new tab.
// Also drives the pop-up: it appears a quarter of the way down the page, unless the reader closed it
// in the last week, is already subscribed, or has reached the newsletter section.
(() => {
  const STORE_KEY = "newsletter";
  const SNOOZE_MS = 7 * 24 * 60 * 60 * 1000;
  const SHOW_AT = 0.25; // fraction of the page scrolled

  const read = () => {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; } catch { return {}; }
  };
  const write = (patch) => {
    try { localStorage.setItem(STORE_KEY, JSON.stringify({ ...read(), ...patch })); } catch { /* storage blocked: ignore */ }
  };

  const popup = document.getElementById("newsletter-popup");
  const section = document.getElementById("section-newsletter");
  let visible = false;
  let closed = false; // closed or subscribed during this visit: stays hidden when scrolling back

  function showPopup() {
    if (visible || closed || !popup) return;
    visible = true;
    popup.hidden = false;
    requestAnimationFrame(() => popup.classList.add("shown")); // next frame so the transition runs
  }

  function hidePopup() {
    if (!visible || !popup) return;
    visible = false;
    popup.classList.remove("shown");
    setTimeout(() => { if (!visible) popup.hidden = true; }, 300); // after the fade
  }

  // ---- Forms ------------------------------------------------------------------------
  const setStatus = (form, state, text) => {
    const status = form.querySelector(".newsletter-status");
    status.dataset.state = state;
    status.textContent = text;
  };

  const subscribe = async (form) => {
    const data = new FormData(form);
    const response = await fetch(form.dataset.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: data.get("email"),
        name: data.get("name") || "",
        list_uuids: [form.dataset.list],
      }),
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
      const error = new Error(body.message || `Error ${response.status}`);
      error.fromServer = true; // the server answered: do not retry with the plain form
      throw error;
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.dataset.sending) return;

    form.dataset.sending = "true";
    form.classList.add("is-sending");
    setStatus(form, "info", "Subscribing…");

    try {
      await subscribe(form);
      write({ subscribed: true });
      closed = true;
      form.reset();
      setStatus(form, "success", "Thanks! Check your inbox to confirm your subscription.");
      document.querySelectorAll(".newsletter-form").forEach((other) => {
        if (other !== form) setStatus(other, "success", "You are subscribed.");
      });
      setTimeout(hidePopup, 6000);
    } catch (error) {
      if (error.fromServer) {
        setStatus(form, "error", error.message);
      } else {
        // blocked or offline: fall back to the plain form (listmonk's page, new tab)
        setStatus(form, "info", "Opening the subscription page…");
        form.removeEventListener("submit", onSubmit);
        form.submit();
      }
    } finally {
      delete form.dataset.sending;
      form.classList.remove("is-sending");
    }
  };

  document.querySelectorAll(".newsletter-form").forEach((form) => form.addEventListener("submit", onSubmit));

  // ---- Pop-up -------------------------------------------------------------------------
  if (!popup) return;

  const state = read();
  const snoozed = state.subscribed || (state.dismissedAt && Date.now() - state.dismissedAt < SNOOZE_MS);
  if (snoozed) { popup.remove(); return; }

  popup.querySelector(".newsletter-close").addEventListener("click", () => {
    write({ dismissedAt: Date.now() });
    closed = true;
    hidePopup();
  });
  popup.addEventListener("keydown", (event) => {
    if (event.key === "Escape") popup.querySelector(".newsletter-close").click();
  });

  let queued = false;
  const update = () => {
    queued = false;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
    // the section already offers the form once its top is on screen
    const sectionReached = section ? section.getBoundingClientRect().top < window.innerHeight : false;
    if (progress >= SHOW_AT && !sectionReached) showPopup(); else hidePopup();
  };
  window.addEventListener("scroll", () => {
    if (!queued) { queued = true; requestAnimationFrame(update); }
  }, { passive: true });
})();
