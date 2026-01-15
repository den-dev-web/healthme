import { $$ } from "../utils/dom.js";

export const initReveal = () => {
  const items = $$("[data-reveal]");
  if (!items.length) return;

  if (!("IntersectionObserver" in window)) {
    items.forEach((item) => {
      item.dataset.visible = "true";
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.dataset.visible = "true";
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  items.forEach((item) => {
    item.dataset.revealReady = "true";
    item.dataset.visible = "false";
    observer.observe(item);
  });

  requestAnimationFrame(() => {
    items.forEach((item) => {
      const rect = item.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (inView) {
        item.dataset.visible = "true";
        observer.unobserve(item);
      }
    });
  });
};
