const formatRating = (rating) => rating.toFixed(1);

const createAvatar = (doctor) => {
  const wrapper = document.createElement("div");
  wrapper.className = "doctor-card__avatar";

  const picture = document.createElement("picture");
  picture.className = "doctor-card__picture";

  const sources = doctor.image || {};
  const fallback = {
    avif: "./src/assets/images/doctor-placeholder.avif",
    webp: "./src/assets/images/doctor-placeholder.webp",
    jpg: "./src/assets/images/doctor-placeholder.jpg",
  };

  const sourceAvif = document.createElement("source");
  sourceAvif.type = "image/avif";
  sourceAvif.srcset = sources.avif || fallback.avif;

  const sourceWebp = document.createElement("source");
  sourceWebp.type = "image/webp";
  sourceWebp.srcset = sources.webp || fallback.webp;

  const image = document.createElement("img");
  image.className = "doctor-card__photo";
  image.src = sources.jpg || fallback.jpg;
  image.alt = `Фото врача ${doctor.name}`;
  image.width = 72;
  image.height = 72;
  image.loading = "lazy";
  image.decoding = "async";
  picture.append(sourceAvif, sourceWebp, image);

  wrapper.append(picture);
  return wrapper;
};

const createCard = (doctor) => {
  const card = document.createElement("article");
  card.className = "doctor-card";
  card.setAttribute("aria-labelledby", `doctor-${doctor.id}-name`);
  card.dataset.category = doctor.category;

  const avatar = createAvatar(doctor);

  const body = document.createElement("div");
  body.className = "doctor-card__body";

  const name = document.createElement("h3");
  name.className = "doctor-card__name";
  name.id = `doctor-${doctor.id}-name`;
  name.textContent = doctor.name;

  const specialty = document.createElement("p");
  specialty.className = "doctor-card__specialty";
  specialty.textContent = doctor.specialty;

  const meta = document.createElement("div");
  meta.className = "doctor-card__meta";

  const experience = document.createElement("span");
  experience.className = "doctor-card__meta-item";
  experience.textContent = `Опыт ${doctor.experienceYears} лет`;

  meta.append(experience);
  body.append(name, specialty, meta);

  const footer = document.createElement("div");
  footer.className = "doctor-card__footer";

  const rating = document.createElement("span");
  rating.className = "doctor-card__rating";
  rating.textContent = `Рейтинг ${formatRating(doctor.rating)}`;

  const link = document.createElement("a");
  link.className = "doctor-card__cta";
  link.href = `./doctor.html?id=${doctor.id}`;
  link.textContent = "Подробнее";

  footer.append(rating, link);
  card.append(avatar, body, footer);
  return card;
};

export const renderDoctors = (container, doctors) => {
  container.innerHTML = "";
  const fragment = document.createDocumentFragment();
  doctors.forEach((doctor) => fragment.append(createCard(doctor)));
  container.append(fragment);
};
