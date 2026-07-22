"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const menuToggle = document.querySelector(".menu-toggle");
  const siteNav = document.querySelector(".site-nav");
  const dropdown = document.querySelector(".nav-dropdown");
  const dropdownButton = dropdown?.querySelector("button");

  const updateHeader = () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 28);
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  const closeMenu = () => {
    menuToggle?.setAttribute("aria-expanded", "false");
    siteNav?.classList.remove("is-open");
    document.body.classList.remove("menu-open");
    dropdown?.classList.remove("is-open");
    dropdownButton?.setAttribute("aria-expanded", "false");
  };

  menuToggle?.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    siteNav?.classList.toggle("is-open", !isOpen);
    document.body.classList.toggle("menu-open", !isOpen);
  });

  dropdownButton?.addEventListener("click", (event) => {
    event.stopPropagation();
    const isOpen = dropdownButton.getAttribute("aria-expanded") === "true";
    dropdownButton.setAttribute("aria-expanded", String(!isOpen));
    dropdown?.classList.toggle("is-open", !isOpen);
  });

  siteNav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("click", (event) => {
    if (dropdown && !dropdown.contains(event.target)) {
      dropdown.classList.remove("is-open");
      dropdownButton?.setAttribute("aria-expanded", "false");
    }

    if (
      siteNav?.classList.contains("is-open") &&
      !siteNav.contains(event.target) &&
      !menuToggle?.contains(event.target)
    ) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
      dropdown?.classList.remove("is-open");
      dropdownButton?.setAttribute("aria-expanded", "false");
    }
  });

  const faqQuestions = document.querySelectorAll(".faq-question");

  const setFaqState = (question, isOpen) => {
    const item = question.closest(".faq-item");
    const answer = item?.querySelector(".faq-answer");

    question.setAttribute("aria-expanded", String(isOpen));
    item?.classList.toggle("is-open", isOpen);
    answer?.setAttribute("aria-hidden", String(!isOpen));
  };

  faqQuestions.forEach((question, index) => {
    const item = question.closest(".faq-item");
    const answer = item?.querySelector(".faq-answer");
    const answerId = `faq-answer-${index + 1}`;

    if (answer) {
      answer.id = answerId;
      answer.setAttribute("role", "region");
      question.setAttribute("aria-controls", answerId);
    }

    setFaqState(question, question.getAttribute("aria-expanded") === "true");

    question.addEventListener("click", () => {
      const willOpen = question.getAttribute("aria-expanded") !== "true";
      const currentList = question.closest(".faq-list");

      currentList?.querySelectorAll(".faq-question").forEach((otherQuestion) => {
        if (otherQuestion !== question) setFaqState(otherQuestion, false);
      });

      setFaqState(question, willOpen);
    });
  });

  const revealElements = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealElements.forEach((element) => revealObserver.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add("is-visible"));
  }

  const cookieBanner = document.querySelector(".cookie-banner");
  const cookieButton = document.querySelector("[data-cookie-accept]");
  const privacyNoticeKey = "itsl-privacy-notice";
  const privacyNoticeDuration = 180 * 24 * 60 * 60 * 1000;
  let privacyNoticeAcknowledged = false;

  try {
    const storedPrivacyNotice = localStorage.getItem(privacyNoticeKey);

    if (storedPrivacyNotice) {
      const privacyNoticeChoice = JSON.parse(storedPrivacyNotice);
      privacyNoticeAcknowledged =
        privacyNoticeChoice?.acknowledged === true && privacyNoticeChoice.expiresAt > Date.now();

      if (!privacyNoticeAcknowledged) {
        localStorage.removeItem(privacyNoticeKey);
      }
    }
  } catch {
    privacyNoticeAcknowledged = false;
  }

  if (cookieBanner && !privacyNoticeAcknowledged) {
    window.setTimeout(() => cookieBanner.classList.add("is-visible"), 700);
  }

  cookieButton?.addEventListener("click", () => {
    try {
      localStorage.setItem(
        privacyNoticeKey,
        JSON.stringify({
          acknowledged: true,
          expiresAt: Date.now() + privacyNoticeDuration,
        })
      );
    } catch {
      // Der Hinweis kann auch geschlossen werden, wenn der Browser lokale Speicherung blockiert.
    }
    cookieBanner?.classList.remove("is-visible");
  });

  const lightboxLinks = document.querySelectorAll("[data-lightbox]");
  if (lightboxLinks.length) {
    const lightbox = document.createElement("div");
    lightbox.className = "lightbox";
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-modal", "true");
    lightbox.setAttribute("aria-label", "Projektbild vergrößert anzeigen");
    lightbox.innerHTML = `
      <button class="lightbox__close" type="button" aria-label="Bildansicht schließen">×</button>
      <figure class="lightbox__figure">
        <img class="lightbox__image" alt="" />
        <figcaption class="lightbox__caption"></figcaption>
      </figure>
    `;
    document.body.append(lightbox);

    const lightboxImage = lightbox.querySelector(".lightbox__image");
    const lightboxCaption = lightbox.querySelector(".lightbox__caption");
    const lightboxClose = lightbox.querySelector(".lightbox__close");
    let lastLightboxTrigger = null;

    const closeLightbox = () => {
      lightbox.classList.remove("is-open");
      document.body.classList.remove("lightbox-open");
      window.setTimeout(() => lastLightboxTrigger?.focus(), 220);
    };

    lightboxLinks.forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        lastLightboxTrigger = link;
        const preview = link.querySelector("img");
        lightboxImage.src = link.href;
        lightboxImage.alt = preview?.alt || "Vergrößerte Projektansicht";
        lightboxCaption.textContent = link.dataset.lightboxCaption || preview?.alt || "";
        lightbox.classList.add("is-open");
        document.body.classList.add("lightbox-open");
        lightboxClose.focus();
      });
    });

    lightboxClose.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && lightbox.classList.contains("is-open")) closeLightbox();
    });
  }

  const contactForm = document.querySelector("[data-contact-form]");
  const formStatus = document.querySelector("[data-form-status]");

  const requestedService = new URLSearchParams(window.location.search).get("leistung");
  const serviceSelect = document.querySelector("#service");
  if (requestedService && serviceSelect) {
    const matchingOption = Array.from(serviceSelect.options).find(
      (option) => option.value.toLowerCase() === requestedService.toLowerCase()
    );
    if (matchingOption) serviceSelect.value = matchingOption.value;
  }

  contactForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const submitButton = contactForm.querySelector("button[type='submit']");
    const originalLabel = submitButton?.textContent;

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Nachricht wird gesendet …";
    }

    formStatus?.classList.remove("is-visible", "is-success", "is-error");

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        body: new FormData(contactForm),
        headers: { Accept: "application/json" }
      });

      if (!response.ok) throw new Error("Formular konnte nicht gesendet werden.");

      contactForm.reset();
      if (formStatus) {
        formStatus.textContent = "Vielen Dank! Deine Nachricht wurde erfolgreich gesendet. Ich melde mich so bald wie möglich persönlich bei dir.";
        formStatus.classList.add("is-visible", "is-success");
        formStatus.focus();
      }
    } catch (error) {
      if (formStatus) {
        formStatus.textContent = "Das Senden hat leider nicht funktioniert. Bitte versuche es erneut oder schreibe direkt an office@itsolutions-leitner.at.";
        formStatus.classList.add("is-visible", "is-error");
        formStatus.focus();
      }
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = originalLabel;
      }
    }
  });

  const year = document.querySelector("[data-current-year]");
  if (year) year.textContent = new Date().getFullYear();
});
