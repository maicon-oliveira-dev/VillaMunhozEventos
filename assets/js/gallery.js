(function () {
  "use strict";
  function initGallery3D() {
    document.querySelectorAll("[data-gallery-3d]").forEach((gallery) => {
      const track = gallery.querySelector("[data-gallery-track]");
      const previous = gallery.querySelector("[data-gallery-prev]");
      const next = gallery.querySelector("[data-gallery-next]");
      if (!track || !previous || !next) return;
      const cards = () => Array.from(track.querySelectorAll("[data-lightbox]:not([hidden])"));
      let index = 0;
      let touchStart = null;
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
      function update() {
        const items = cards();
        if (!items.length) {
          previous.disabled = true;
          next.disabled = true;
          return;
        }
        index = ((index % items.length) + items.length) % items.length;
        items.forEach((item, position) => {
          const offset = position - index;
          item.dataset.galleryPosition = offset === 0 ? "current" : offset < 0 ? "previous" : "next";
          item.setAttribute("aria-hidden", String(offset !== 0));
        }        );
        previous.disabled = items.length < 2;
        next.disabled = items.length < 2;
      }
      function move(direction) {
        if (cards().length < 2) return;
        index += direction;
        update();
      }
      previous.addEventListener("click", () => move(-1));
      next.addEventListener("click", () => move(1));
      gallery.addEventListener("keydown", (event) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          move(-1);
        }
        if (event.key === "ArrowRight") {
          event.preventDefault();
          move(1);
        }
      }      );
      track.addEventListener("touchstart", (event) => {
        touchStart = event.touches[0]?.clientX ?? null;
      }      , {
        passive: true
      }      );
      track.addEventListener("touchend", (event) => {
        const end = event.changedTouches[0]?.clientX;
        if (touchStart === null || typeof end !== "number") return;
        const delta = end - touchStart;
        touchStart = null;
        if (Math.abs(delta) > 42) move(delta > 0 ? -1 : 1);
      }      , {
        passive: true
      }      );
      if (reducedMotion.matches) gallery.dataset.reducedMotion = "true";
      update();
      gallery.addEventListener("gallery:filter", () => {
        index = 0;
        update();
      }      );
    }    );
  }
  window.initGallery3D = initGallery3D;
  document.addEventListener("DOMContentLoaded", initGallery3D, {
    once: true
  }  );
})();
