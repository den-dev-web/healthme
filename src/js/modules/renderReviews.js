const createReviewCard = (review) => {
  const card = document.createElement("article");
  card.className = "review-card";

  const header = document.createElement("div");
  header.className = "review-card__header";

  const person = document.createElement("div");
  person.className = "review-card__person";

  const avatar = document.createElement("img");
  avatar.className = "review-card__avatar";
  avatar.src = review.avatar;
  avatar.alt = `Фото ${review.name}`;
  avatar.loading = "lazy";

  const author = document.createElement("span");
  author.className = "review-card__author";
  author.textContent = `${review.name}, ${review.age}`;

  const rating = document.createElement("div");
  rating.className = "review-card__rating";
  rating.setAttribute("aria-label", `Рейтинг ${review.rating} из 5`);
  rating.textContent = review.rating.toFixed(1);

  const text = document.createElement("p");
  text.className = "review-card__text";
  text.textContent = review.text;

  person.append(avatar, author);
  header.append(person, rating);
  card.append(header, text);

  return card;
};

export const renderReviews = (container, reviews) => {
  container.innerHTML = "";
  reviews.forEach((review) => {
    container.append(createReviewCard(review));
  });
};
