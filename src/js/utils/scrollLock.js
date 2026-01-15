let lockCount = 0;
let scrollY = 0;

export const lockScroll = () => {
  if (lockCount === 0) {
    scrollY = window.scrollY || window.pageYOffset || 0;
    document.documentElement.classList.add("is-modal-open");
    document.body.classList.add("is-modal-open");
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
  }
  lockCount += 1;
};

export const unlockScroll = () => {
  if (lockCount === 0) return;
  lockCount -= 1;
  if (lockCount > 0) return;
  document.documentElement.classList.remove("is-modal-open");
  document.body.classList.remove("is-modal-open");
  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.width = "";
  window.scrollTo(0, scrollY);
};
