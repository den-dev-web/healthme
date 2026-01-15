import { renderReviews } from "./renderReviews.js";
import { $ } from "../utils/dom.js";

const getStepSize = (track) => {
  const firstCard = track.firstElementChild;
  if (!firstCard) return 0;
  const styles = getComputedStyle(track);
  const gap = parseFloat(styles.columnGap || styles.gap || 0);
  return firstCard.getBoundingClientRect().width + gap;
};

export const initReviewsSlider = (reviews) => {
  const track = $("[data-reviews-track]");
  if (!track) return;

  renderReviews(track, reviews);

  const prev = $("[data-reviews-prev]");
  const next = $("[data-reviews-next]");
  if (!prev || !next) return;

  const scrollByStep = (direction) => {
    const step = getStepSize(track);
    if (!step) return;
    const maxScroll = track.scrollWidth - track.clientWidth;
    const atStart = track.scrollLeft <= 1;
    const atEnd = track.scrollLeft >= maxScroll - 1;

    if (direction < 0 && atStart) {
      track.scrollTo({ left: maxScroll, behavior: "smooth" });
      return;
    }
    if (direction > 0 && atEnd) {
      track.scrollTo({ left: 0, behavior: "smooth" });
      return;
    }

    track.scrollBy({ left: step * direction, behavior: "smooth" });
  };

  prev.addEventListener("click", () => scrollByStep(-1));
  next.addEventListener("click", () => scrollByStep(1));
};
