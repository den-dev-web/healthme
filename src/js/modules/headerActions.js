import { $ } from "../utils/dom.js";
import { lockScroll, unlockScroll } from "../utils/scrollLock.js";

export const initHeaderActions = () => {
  const searchButton = $("[data-action='search']");
  const notificationsButton = $("[data-action='notifications']");
  const categoriesSection = $("#categories");
  const modal = $("[data-modal='notifications']");
  const closeButtons = modal
    ? [...modal.querySelectorAll("[data-modal-close]")]
    : [];

  let lastFocused = null;

  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove("modal--visible");
    modal.setAttribute("aria-hidden", "true");
    unlockScroll();
    document.removeEventListener("keydown", onKeydown);
    if (lastFocused && typeof lastFocused.focus === "function") {
      lastFocused.focus();
    }
  };

  const onKeydown = (event) => {
    if (event.key !== "Escape") return;
    event.preventDefault();
    closeModal();
  };

  const openModal = () => {
    if (!modal) return;
    lastFocused = document.activeElement;
    modal.classList.add("modal--visible");
    modal.setAttribute("aria-hidden", "false");
    lockScroll();
    const initialFocus =
      modal.querySelector("[data-modal-initial-focus]") ||
      modal.querySelector(".modal__close") ||
      modal.querySelector("[role='dialog']");
    if (initialFocus && typeof initialFocus.focus === "function") {
      initialFocus.focus();
    }
    document.addEventListener("keydown", onKeydown);
  };

  if (searchButton) {
    searchButton.addEventListener("click", () => {
      if (categoriesSection) {
        categoriesSection.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        window.location.href = "./index.html#categories";
      }
    });
  }

  if (notificationsButton && modal) {
    notificationsButton.addEventListener("click", openModal);
  }

  closeButtons.forEach((button) => {
    button.addEventListener("click", closeModal);
  });
};
