import { doctors } from "../data/doctors.js";
import { $, $$ } from "../utils/dom.js";

const formatPrice = (price) => `${price.toLocaleString("uk-UA")} ₴`;

const getDoctorId = () => {
  const params = new URLSearchParams(window.location.search);
  return Number(params.get("id"));
};

const buildSchedule = () => [
  { time: "09:00", available: true },
  { time: "09:30", available: false },
  { time: "10:00", available: true },
  { time: "11:00", available: true },
  { time: "12:30", available: true },
  { time: "14:00", available: false },
  { time: "15:30", available: true },
  { time: "16:00", available: true },
  { time: "17:30", available: true },
];

const renderSchedule = (container) => {
  const slots = buildSchedule();
  container.innerHTML = "";
  slots.forEach((slot, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "schedule-slot";
    button.textContent = slot.time;
    button.dataset.selected = "false";
    if (!slot.available) {
      button.disabled = true;
      button.classList.add("schedule-slot--disabled");
    }
    button.dataset.index = index;
    container.append(button);
  });

  container.addEventListener("click", (event) => {
    const target = event.target.closest(".schedule-slot");
    if (!target || target.disabled) return;

    container
      .querySelectorAll(".schedule-slot")
      .forEach((slot) => (slot.dataset.selected = "false"));
    target.dataset.selected = "true";
  });
};

export const initDoctorPage = () => {
  const profileName = $("[data-doctor-name]");
  if (!profileName) return;

  const doctorId = getDoctorId();
  const doctor = doctors.find((item) => item.id === doctorId) || doctors[0];

  const setTextAll = (selector, value) => {
    $$(selector).forEach((node) => {
      node.textContent = value;
    });
  };

  setTextAll("[data-doctor-name]", doctor.name);
  setTextAll("[data-doctor-specialty]", doctor.specialty);
  const experienceText = `Опыт ${doctor.experienceYears} лет`;
  setTextAll("[data-doctor-experience]", experienceText);
  setTextAll(
    "[data-doctor-rating]",
    `Рейтинг ${doctor.rating.toFixed(1)}`
  );
  setTextAll("[data-doctor-description]", doctor.description);
  setTextAll(
    "[data-doctor-price]",
    `Цена за консультацию ${formatPrice(doctor.price)}`
  );

  const avatar = $("[data-doctor-avatar]");
  if (avatar) {
    const sources = doctor.image || {};
    const fallback = {
      avif: "./src/assets/images/doctor-placeholder.avif",
      webp: "./src/assets/images/doctor-placeholder.webp",
      jpg: "./src/assets/images/doctor-placeholder.jpg",
    };
    const sourceAvif = $("[data-doctor-source-avif]");
    const sourceWebp = $("[data-doctor-source-webp]");
    if (sourceAvif) {
      sourceAvif.srcset = sources.avif || fallback.avif;
    }
    if (sourceWebp) {
      sourceWebp.srcset = sources.webp || fallback.webp;
    }
    avatar.src = sources.jpg || fallback.jpg;
    avatar.alt = `Фото врача ${doctor.name}`;
  }

  const categorySelect = $("#category");
  if (categorySelect) {
    categorySelect.value = doctor.category;
    categorySelect.dispatchEvent(new Event("change", { bubbles: true }));
  }

  const schedule = $("[data-schedule]");
  if (schedule) {
    renderSchedule(schedule);
  }
};
