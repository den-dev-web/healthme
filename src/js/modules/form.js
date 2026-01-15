import { $, $$ } from "../utils/dom.js";
import { lockScroll, unlockScroll } from "../utils/scrollLock.js";

const isValidPhone = (value) => /^(\+?\d[\d\s()-]{7,})$/.test(value.trim());

const setFieldError = (field, message) => {
  const errorId = field.getAttribute("aria-describedby");
  const error = errorId ? document.getElementById(errorId) : null;
  if (error) {
    error.textContent = message;
  }
};

const clearFieldError = (field) => setFieldError(field, "");

const setStatus = (statusEl, message) => {
  if (statusEl) {
    statusEl.textContent = message;
  }
};

const initCustomSelects = (form) => {
  const selects = form.querySelectorAll("[data-select]");
  if (!selects.length) return;

  selects.forEach((selectWrap) => {
    const select = selectWrap.querySelector("select");
    const trigger = selectWrap.querySelector("[data-select-trigger]");
    const list = selectWrap.querySelector("[data-select-list]");
    const modal = selectWrap.querySelector("[data-select-modal]");
    const closeTargets = selectWrap.querySelectorAll("[data-select-close]");
    const valueEl = selectWrap.querySelector("[data-select-value]");

    if (!select || !trigger || !list || !modal || !valueEl) return;

    const buildOptions = () => {
      list.innerHTML = "";
      Array.from(select.options).forEach((option) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "booking-form__select-option";
        button.setAttribute("role", "option");
        button.dataset.value = option.value;
        button.textContent = option.textContent;
        list.appendChild(button);
      });
    };

    const syncValue = () => {
      const selectedOption = select.selectedOptions[0];
      valueEl.textContent =
        selectedOption?.textContent || select.options[0]?.textContent || "";

      Array.from(list.children).forEach((optionEl) => {
        const isSelected =
          optionEl.dataset.value === (selectedOption?.value || "");
        optionEl.setAttribute("aria-selected", isSelected ? "true" : "false");
      });
    };

    const setOpen = (isOpen) => {
      selectWrap.classList.toggle("is-open", isOpen);
      trigger.setAttribute("aria-expanded", isOpen ? "true" : "false");
      document.body.classList.toggle("is-modal-open", isOpen);
    };

    const setDisabled = () => {
      const isDisabled = select.disabled;
      selectWrap.classList.toggle("is-disabled", isDisabled);
      trigger.disabled = isDisabled;
    };

    buildOptions();
    syncValue();
    setDisabled();

    trigger.addEventListener("click", () => {
      if (select.disabled) return;
      setOpen(!selectWrap.classList.contains("is-open"));
    });

    closeTargets.forEach((target) => {
      target.addEventListener("click", () => setOpen(false));
    });

    list.addEventListener("click", (event) => {
      const option = event.target.closest("[data-value]");
      if (!option || select.disabled) return;
      select.value = option.dataset.value;
      select.dispatchEvent(new Event("change", { bubbles: true }));
      setOpen(false);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    });

    select.addEventListener("change", syncValue);
    form.addEventListener("reset", () => {
      setTimeout(() => {
        syncValue();
        setDisabled();
      }, 0);
    });
  });
};

const initSingleForm = (form) => {
  initCustomSelects(form);

  const name = $("#name", form);
  const phone = $("#phone", form);
  const category = $("#category", form);
  const consent = $("#consent", form);
  const statusEl = $(".booking-form__status", form);
  const submitButton = $(".booking-form__submit", form);
  const initialButtonText = submitButton ? submitButton.textContent : "";

  const setState = (state) => {
    form.dataset.state = state;
    if (!submitButton) return;

    if (state === "loading") {
      submitButton.disabled = true;
      submitButton.textContent = "Отправляем...";
    } else {
      submitButton.disabled = false;
      submitButton.textContent = initialButtonText;
    }
  };

  const validate = () => {
    let valid = true;

    if (name && !name.value.trim()) {
      setFieldError(name, "Введите имя.");
      valid = false;
    } else if (name) {
      clearFieldError(name);
    }

    if (phone && !phone.value.trim()) {
      setFieldError(phone, "Введите телефон.");
      valid = false;
    } else if (phone && !isValidPhone(phone.value)) {
      setFieldError(phone, "Проверьте номер телефона.");
      valid = false;
    } else if (phone) {
      clearFieldError(phone);
    }

    if (category && !category.value) {
      setFieldError(category, "Выберите категорию врача.");
      valid = false;
    } else if (category) {
      clearFieldError(category);
    }

    if (consent && !consent.checked) {
      setFieldError(consent, "Нужно согласие на обработку данных.");
      valid = false;
    } else if (consent) {
      clearFieldError(consent);
    }

    return valid;
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    setStatus(statusEl, "Проверяем данные...");

    if (!validate()) {
      setStatus(statusEl, "Пожалуйста, исправьте ошибки.");
      return;
    }

    setState("loading");
    setStatus(statusEl, "Отправляем заявку...");

    const payload = {
      name: name ? name.value.trim() : "",
      phone: phone ? phone.value.trim() : "",
      category: category ? category.value : "",
      comment: $("#comment", form)?.value.trim() || "",
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error("Bad response");
      }

      setState("success");
      setStatus(
        statusEl,
        "Заявка отправлена. Мы свяжемся с вами в течение часа."
      );
      form.reset();
    } catch (error) {
      setState("error");
      setStatus(
        statusEl,
        "Не удалось отправить заявку. Проверьте интернет и попробуйте снова."
      );
    } finally {
      if (form.dataset.state !== "success") {
        setState("idle");
      }
    }
  });
};

const initFormModals = () => {
  const triggers = $$("[data-form-open]");
  if (!triggers.length) return;

  triggers.forEach((trigger) => {
    const targetId = trigger.dataset.formOpen;
    if (!targetId) return;
    const modal = document.getElementById(targetId);
    if (!modal) return;
    const closeButtons = $$("[data-form-close]", modal);
    let lastFocused = null;

    const onKeydown = (event) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      closeModal();
    };

    const openModal = () => {
      lastFocused = document.activeElement;
      modal.classList.add("modal--visible");
      modal.setAttribute("aria-hidden", "false");
      lockScroll();
      const initialFocus =
        modal.querySelector("[data-modal-initial-focus]") ||
        modal.querySelector("button, [href], input, select, textarea");
      if (initialFocus && typeof initialFocus.focus === "function") {
        initialFocus.focus();
      }
      document.addEventListener("keydown", onKeydown);
    };

    const closeModal = () => {
      modal.classList.remove("modal--visible");
      modal.setAttribute("aria-hidden", "true");
      unlockScroll();
      document.removeEventListener("keydown", onKeydown);
      if (lastFocused && typeof lastFocused.focus === "function") {
        lastFocused.focus();
      }
    };

    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      openModal();
    });
    closeButtons.forEach((button) => {
      button.addEventListener("click", closeModal);
    });
  });
};

export const initForm = () => {
  const forms = $$("[data-form]");
  if (!forms.length) return;

  forms.forEach((form) => initSingleForm(form));
  initFormModals();
};
