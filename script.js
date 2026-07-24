"use strict";

const header = document.querySelector("#header");
const menuButton = document.querySelector("#menuButton");
const nav = document.querySelector("#nav");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let lastScrollY = window.scrollY;

function updateHeader() {
  const currentScrollY = window.scrollY;
  header.classList.toggle("is-scrolled", currentScrollY > 24);
  header.classList.toggle(
    "is-hidden",
    currentScrollY > lastScrollY && currentScrollY > 500 && !nav.classList.contains("is-open")
  );
  lastScrollY = currentScrollY;
}

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

function closeMenu() {
  nav.classList.remove("is-open");
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Abrir menu");
  document.body.classList.remove("menu-open");
}

menuButton.addEventListener("click", () => {
  const willOpen = !nav.classList.contains("is-open");
  nav.classList.toggle("is-open", willOpen);
  menuButton.setAttribute("aria-expanded", String(willOpen));
  menuButton.setAttribute("aria-label", willOpen ? "Fechar menu" : "Abrir menu");
  document.body.classList.toggle("menu-open", willOpen);
});

nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

const revealItems = document.querySelectorAll(".reveal");

if (reduceMotion || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -45px" }
  );

  revealItems.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
    revealObserver.observe(item);
  });
}

const parallaxElements = document.querySelectorAll("[data-parallax]");
let parallaxFrame = null;

function updateParallax() {
  parallaxElements.forEach((element) => {
    const rect = element.parentElement.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) return;
    const offset = (rect.top + rect.height / 2 - window.innerHeight / 2) * -0.035;
    element.style.transform = `translate3d(0, ${offset}px, 0) scale(1.04)`;
  });
  parallaxFrame = null;
}

if (!reduceMotion) {
  window.addEventListener(
    "scroll",
    () => {
      if (!parallaxFrame) parallaxFrame = requestAnimationFrame(updateParallax);
    },
    { passive: true }
  );
  updateParallax();
}

const filters = document.querySelectorAll(".filter");
const propertyCards = document.querySelectorAll(".property-card");

filters.forEach((filter) => {
  filter.addEventListener("click", () => {
    const selectedFilter = filter.dataset.filter;
    filters.forEach((item) => item.classList.toggle("is-active", item === filter));

    propertyCards.forEach((card) => {
      const shouldShow = selectedFilter === "todos" || card.dataset.category === selectedFilter;
      card.classList.toggle("is-hidden", !shouldShow);
    });
  });
});

document.querySelectorAll(".favorite").forEach((button) => {
  button.addEventListener("click", () => {
    const isFavorite = button.getAttribute("aria-pressed") === "true";
    button.setAttribute("aria-pressed", String(!isFavorite));
    button.textContent = isFavorite ? "♡" : "♥";
  });
});

document.querySelectorAll(".js-property-contact").forEach((link) => {
  const property = link.dataset.property;
  const message = `Olá, Sandra! Vi o anúncio “${property}” no site e gostaria de mais informações.`;
  link.href = `https://wa.me/5571972222604?text=${encodeURIComponent(message)}`;
});

const accordionButtons = document.querySelectorAll(".accordion__item button");

accordionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const answerId = button.getAttribute("aria-controls");
    const answer = document.getElementById(answerId);
    const willOpen = button.getAttribute("aria-expanded") !== "true";

    accordionButtons.forEach((otherButton) => {
      const otherAnswer = document.getElementById(otherButton.getAttribute("aria-controls"));
      otherButton.setAttribute("aria-expanded", "false");
      otherButton.querySelector("span").textContent = "+";
      otherAnswer.classList.remove("is-open");
    });

    if (willOpen) {
      button.setAttribute("aria-expanded", "true");
      button.querySelector("span").textContent = "−";
      answer.classList.add("is-open");
    }
  });
});

const testimonialTrack = document.querySelector("#testimonialTrack");
const testimonialCards = testimonialTrack.querySelectorAll(".testimonial-card");
const previousButton = document.querySelector("#testimonialPrev");
const nextButton = document.querySelector("#testimonialNext");
let testimonialIndex = 0;

function visibleTestimonials() {
  if (window.innerWidth <= 600) return 1;
  if (window.innerWidth <= 820) return 2;
  return 3;
}

function updateTestimonials() {
  const visible = visibleTestimonials();
  const maximumIndex = Math.max(0, testimonialCards.length - visible);
  testimonialIndex = Math.min(testimonialIndex, maximumIndex);
  const cardWidth = testimonialCards[0].getBoundingClientRect().width;
  const gap = 18;
  testimonialTrack.style.transform = `translateX(-${testimonialIndex * (cardWidth + gap)}px)`;
}

previousButton.addEventListener("click", () => {
  testimonialIndex = Math.max(0, testimonialIndex - 1);
  updateTestimonials();
});

nextButton.addEventListener("click", () => {
  const max = Math.max(0, testimonialCards.length - visibleTestimonials());
  testimonialIndex = Math.min(max, testimonialIndex + 1);
  updateTestimonials();
});

window.addEventListener("resize", updateTestimonials);
updateTestimonials();

document.querySelector("#currentYear").textContent = new Date().getFullYear();
