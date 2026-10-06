(function () {
  "use strict";

  const videos = document.querySelectorAll("[data-center-play]");

  if (!videos.length) return;

  videos.forEach((video) => {
    video.addEventListener("click", (event) => {
      const bounds = video.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width;
      const y = (event.clientY - bounds.top) / bounds.height;
      const isCenter = x > .2 && x < .8 && y > .15 && y < .75;

      if (!isCenter || !video.paused) return;

      video.play().catch(() => {});
    });
  });
})();
