import { doctors } from "./data/doctors.js";
import { reviews } from "./data/reviews.js";
import { renderDoctors } from "./modules/renderDoctors.js";
import { initCategoryFilter } from "./modules/filterCategories.js";
import { initBottomNav } from "./modules/bottomNav.js";
import { initHeaderActions } from "./modules/headerActions.js";
import { initReveal } from "./modules/reveal.js";
import { initForm } from "./modules/form.js";
import { initDoctorPage } from "./modules/doctorPage.js";
import { initReviewsSlider } from "./modules/reviewsSlider.js";
import { $ } from "./utils/dom.js";

document.documentElement.classList.add("js-enabled");

const applyDoctors = (category) => {
  const container = $("[data-doctors-grid]");
  const emptyState = $("[data-doctors-empty]");
  if (!container) return;

  const filtered =
    category === "all"
      ? doctors
      : doctors.filter((doctor) => doctor.category === category);

  renderDoctors(container, filtered);

  if (emptyState) {
    emptyState.classList.toggle("u-hidden", filtered.length > 0);
  }
};

const initIndexPage = () => {
  if (!$("[data-doctors-grid]")) return;

  applyDoctors("all");

  initCategoryFilter({
    onChange: (category) => applyDoctors(category),
  });

  initHeaderActions();
  initBottomNav();
  initReveal();
  initForm();
  initReviewsSlider(reviews);
};

const initDoctorView = () => {
  if (!$("[data-doctor-name]")) return;
  initHeaderActions();
  initDoctorPage();
  initReveal();
  initForm();
  initReviewsSlider(reviews);
};

document.addEventListener("DOMContentLoaded", () => {
  initIndexPage();
  initDoctorView();
});
