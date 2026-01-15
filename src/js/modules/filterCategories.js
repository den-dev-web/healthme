import { $ } from "../utils/dom.js";

export const initCategoryFilter = ({ onChange }) => {
  const container = $(".categories__scroller");
  if (!container) return;
  const pagination = $(".categories__pagination");
  const chips = [...container.querySelectorAll(".category-chip")];

  let scrollFrame = null;

  const setActive = (target) => {
    container.querySelectorAll(".category-chip").forEach((btn) => {
      btn.setAttribute("aria-selected", btn === target ? "true" : "false");
    });
  };

  const setActiveDot = (index) => {
    if (!pagination) return;
    const dots = [...pagination.querySelectorAll(".categories__dot")];
    dots.forEach((dot, dotIndex) => {
      dot.setAttribute("aria-selected", dotIndex === index ? "true" : "false");
    });
  };

  const getCenteredIndex = () => {
    const center = container.scrollLeft + container.clientWidth / 2;
    let closestIndex = 0;
    let closestDistance = Infinity;
    chips.forEach((chip, index) => {
      const chipCenter = chip.offsetLeft + chip.offsetWidth / 2;
      const distance = Math.abs(chipCenter - center);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });
    return closestIndex;
  };

  const updateDots = () => {
    if (!pagination) return;
    setActiveDot(getCenteredIndex());
  };

  container.addEventListener("click", (event) => {
    const button = event.target.closest(".category-chip");
    if (!button) return;
    const category = button.dataset.category || "all";
    setActive(button);
    if (pagination) {
      setActiveDot(chips.indexOf(button));
    }
    onChange(category);
  });

  if (pagination && chips.length) {
    pagination.innerHTML = "";
    chips.forEach((chip, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "categories__dot";
      dot.setAttribute("aria-label", `Категория ${index + 1}`);
      dot.setAttribute("aria-selected", "false");
      dot.addEventListener("click", () => {
        chip.scrollIntoView({ behavior: "smooth", inline: "center" });
        setActiveDot(index);
      });
      pagination.appendChild(dot);
    });

    updateDots();

    container.addEventListener("scroll", () => {
      if (scrollFrame) return;
      scrollFrame = window.requestAnimationFrame(() => {
        scrollFrame = null;
        updateDots();
      });
    });
  }
};
