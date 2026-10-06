(function () {
  "use strict";

  const DISPLAY_DURATION = 3000;
  const TRANSITION_DURATION = 900;

  function initIntroCarousel() {
    document.querySelectorAll("[data-carousel]").forEach((carousel) => {
      const track = carousel.querySelector(".intro-carousel__track");
      const slides = Array.from(carousel.querySelectorAll("[data-carousel-slide]"));
      const controls = carousel.querySelector("[data-carousel-controls]");
      const previous = carousel.querySelector("[data-carousel-previous]");
      const next = carousel.querySelector("[data-carousel-next]");
      const dots = Array.from(carousel.querySelectorAll("[data-carousel-dot]"));
      const current = carousel.querySelector("[data-carousel-current]");
      const status = carousel.querySelector("[data-carousel-status]");
      const toggle = carousel.querySelector("[data-carousel-toggle]");
      const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      let activeIndex = 0;
      let touchStart = null;
      let autoplayTimer = null;
      let transitionTimer = null;
      let isTransitioning = false;
      let isHovered = false;
      let isFocused = false;
      let isInViewport = !("IntersectionObserver" in window);
      let userPaused = false;
      let reducedMotion = motionQuery.matches;

      if (!track || !controls || !previous || !next || !current || !status || !toggle || slides.length < 2) return;

      carousel.classList.add("is-enhanced");
      controls.hidden = false;

      function stopAutoplay() {
        if (autoplayTimer !== null) {
          window.clearTimeout(autoplayTimer);
          autoplayTimer = null;
        }
      }

      function stopTransitionTimer() {
        if (transitionTimer !== null) {
          window.clearTimeout(transitionTimer);
          transitionTimer = null;
        }
      }

      function canAutoplay() {
        return !userPaused && !reducedMotion && !document.hidden && isInViewport && !isHovered && !isFocused && !isTransitioning;
      }

      function updateToggle() {
        const isPaused = userPaused || reducedMotion;
        toggle.textContent = isPaused ? "Reproduzir" : "Pausar";
        toggle.setAttribute("aria-pressed", String(isPaused));
        toggle.disabled = reducedMotion;
      }

      function scheduleAutoplay() {
        stopAutoplay();
        if (!canAutoplay()) return;

        autoplayTimer = window.setTimeout(() => {
          autoplayTimer = null;
          showSlide(activeIndex + 1, { manual: false });
        }, DISPLAY_DURATION);
      }

      function completeTransition() {
        if (!isTransitioning) return;
        isTransitioning = false;
        stopTransitionTimer();
        scheduleAutoplay();
      }

      function showSlide(index, { manual = false } = {}) {
        if (isTransitioning) return;

        stopAutoplay();
        activeIndex = (index + slides.length) % slides.length;
        track.style.transform = `translateX(-${activeIndex * 100}%)`;
        current.textContent = String(activeIndex + 1);

        slides.forEach((slide, slideIndex) => {
          const isActive = slideIndex === activeIndex;
          slide.setAttribute("aria-hidden", String(!isActive));
          slide.inert = !isActive;
        });

        dots.forEach((dot, dotIndex) => dot.setAttribute("aria-current", String(dotIndex === activeIndex)));

        if (manual) {
          const title = slides[activeIndex].querySelector("strong")?.textContent || `Imagem ${activeIndex + 1}`;
          status.textContent = `Imagem ${activeIndex + 1} de ${slides.length}: ${title}.`;
        }

        if (reducedMotion) {
          scheduleAutoplay();
          return;
        }

        isTransitioning = true;
        transitionTimer = window.setTimeout(completeTransition, TRANSITION_DURATION + 100);
      }

      function navigate(index) {
        showSlide(index, { manual: true });
      }

      previous.addEventListener("click", () => navigate(activeIndex - 1));
      next.addEventListener("click", () => navigate(activeIndex + 1));
      dots.forEach((dot, index) => dot.addEventListener("click", () => navigate(index)));

      toggle.addEventListener("click", () => {
        if (reducedMotion) return;
        userPaused = !userPaused;
        updateToggle();
        if (userPaused) {
          stopAutoplay();
        } else {
          scheduleAutoplay();
        }
      });

      carousel.addEventListener("keydown", (event) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          navigate(activeIndex - 1);
        } else if (event.key === "ArrowRight") {
          event.preventDefault();
          navigate(activeIndex + 1);
        }
      });

      carousel.addEventListener("mouseenter", () => {
        isHovered = true;
        stopAutoplay();
      });

      carousel.addEventListener("mouseleave", () => {
        isHovered = false;
        scheduleAutoplay();
      });

      carousel.addEventListener("focusin", () => {
        isFocused = true;
        stopAutoplay();
      });

      carousel.addEventListener("focusout", () => {
        window.setTimeout(() => {
          isFocused = carousel.contains(document.activeElement);
          scheduleAutoplay();
        }, 0);
      });

      carousel.addEventListener("touchstart", (event) => {
        if (event.touches.length !== 1) {
          touchStart = null;
          return;
        }
        const touch = event.touches[0];
        touchStart = { x: touch.clientX, y: touch.clientY };
      }, { passive: true });

      carousel.addEventListener("touchmove", (event) => {
        if (event.touches.length > 1) touchStart = null;
      }, { passive: true });

      carousel.addEventListener("touchend", (event) => {
        if (!touchStart || event.changedTouches.length !== 1) return;
        const touch = event.changedTouches[0];
        const distanceX = touch.clientX - touchStart.x;
        const distanceY = touch.clientY - touchStart.y;
        touchStart = null;
        if (Math.abs(distanceX) < 40 || Math.abs(distanceX) <= Math.abs(distanceY)) return;
        navigate(activeIndex + (distanceX < 0 ? 1 : -1));
      }, { passive: true });

      track.addEventListener("transitionend", (event) => {
        if (event.target === track && event.propertyName === "transform") completeTransition();
      });

      document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
          stopAutoplay();
        } else {
          scheduleAutoplay();
        }
      });

      if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(([entry]) => {
          isInViewport = entry.isIntersecting;
          if (isInViewport) {
            scheduleAutoplay();
          } else {
            stopAutoplay();
          }
        }, { threshold: .2 });
        observer.observe(carousel);
      } else {
        scheduleAutoplay();
      }

      motionQuery.addEventListener("change", (event) => {
        reducedMotion = event.matches;
        updateToggle();
        if (reducedMotion) {
          stopAutoplay();
        } else {
          scheduleAutoplay();
        }
      });

      slides.forEach((slide, index) => {
        const isActive = index === 0;
        slide.setAttribute("aria-hidden", String(!isActive));
        slide.inert = !isActive;
      });
      updateToggle();
    });
  }

  document.addEventListener("DOMContentLoaded", initIntroCarousel, { once: true });
})();
