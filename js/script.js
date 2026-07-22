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
  const cookieChoice = localStorage.getItem("itsl-privacy-notice");

  if (cookieBanner && !cookieChoice) {
    window.setTimeout(() => cookieBanner.classList.add("is-visible"), 700);
  }

  cookieButton?.addEventListener("click", () => {
    localStorage.setItem("itsl-privacy-notice", "accepted");
    cookieBanner?.classList.remove("is-visible");
  });

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
