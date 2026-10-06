(function () {
  "use strict";
  function initLightbox() {
    const dialog = document.querySelector("[data-lightbox-dialog]");
    if (!dialog) return;
    const image = dialog.querySelector("[data-lightbox-image]");
    const caption = dialog.querySelector("[data-lightbox-caption]");
    const counter = dialog.querySelector("[data-lightbox-counter]");
    const close = dialog.querySelector("[data-lightbox-close]");
    const previous = dialog.querySelector("[data-lightbox-prev]");
    const next = dialog.querySelector("[data-lightbox-next]");
    let trigger = null, active = null;
    const items = () => Array.from(document.querySelectorAll("[data-lightbox]")).filter((item) => !item.hidden && item.offsetParent !== null);
    function render(item) {
      const list = items();
      active = list.indexOf(item);
      const img = item.querySelector("img");
      image.src = item.dataset.src || img?.currentSrc || img?.src || "";
      image.alt = item.dataset.caption || img?.alt || "";
      caption.textContent = image.alt;
      counter.textContent = `${active + 1} / ${list.length}`;
      previous.disabled = next.disabled = list.length < 2;
    }
    function open(item) {
      trigger = item;
      render(item);
      dialog.hidden = false;
      document.body.classList.add("lightbox-open");
      close.focus();
    }
    function shut() {
      dialog.hidden = true;
      document.body.classList.remove("lightbox-open");
      trigger?.focus();
    }
    function move(delta) {
      const list = items();
      if (list.length > 1) render(list[(active + delta + list.length) % list.length]);
    }
    document.addEventListener("click", (event) => {
      const item = event.target.closest("[data-lightbox]");
      if (item && !item.hidden) open(item);
    }    );
    document.addEventListener("keydown", (event) => {
      if (dialog.hidden) return;
      if (event.key === "Escape") {
        event.preventDefault();
        shut();
      }
      if (event.key === "ArrowLeft") move(-1);
      if (event.key === "ArrowRight") move(1);
      if (event.key === "Tab") {
        const focusable = [close, previous, next].filter((el) => !el.disabled);
        const first = focusable[0], last = focusable.at(-1);
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }    );
    close.addEventListener("click", shut);
    previous.addEventListener("click", () => move(-1));
    next.addEventListener("click", () => move(1));
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) shut();
    }    );
  }
  window.initLightbox = initLightbox;
  document.addEventListener("DOMContentLoaded", initLightbox, {
    once: true
  }  );
})();
