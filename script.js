
/* =========================================
   LAKSHANA S. — PORTFOLIO INTERACTIONS
   ========================================= */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  const navItems = document.querySelectorAll(".nav-links a");
  const backToTop = document.querySelector(".back-to-top");
  const yearElement = document.querySelector("#current-year");
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // Automatically update the footer year.
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // Mobile navigation.
  function closeMenu() {
    if (!menuToggle || !navLinks) return;

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
    navLinks.classList.remove("open");
  }

  function openMenu() {
    if (!menuToggle || !navLinks) return;

    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Close navigation menu");
    navLinks.classList.add("open");
  }

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";

      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Close the menu after selecting a navigation link.
    navItems.forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    // Close the menu using the Escape key.
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
        menuToggle.focus();
      }
    });

    // Close the mobile menu when switching to desktop width.
    window.addEventListener("resize", () => {
      if (window.innerWidth > 760) {
        closeMenu();
      }
    });

    // Close the menu when clicking outside it.
    document.addEventListener("click", (event) => {
      const clickedInsideMenu = navLinks.contains(event.target);
      const clickedToggle = menuToggle.contains(event.target);

      if (!clickedInsideMenu && !clickedToggle) {
        closeMenu();
      }
    });
  }

  // Reveal sections as they enter the viewport.
  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window && !reducedMotion) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -35px 0px"
      }
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  } else {
    // Keep all content visible if animations are unsupported or disabled.
    revealElements.forEach((element) => {
      element.classList.add("is-visible");
    });
  }

  // Subtle pointer-controlled 3D tilt on larger screens.
  const tiltCards = document.querySelectorAll(".tilt-card");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const motionPreference = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  function enableTilt() {
    if (!finePointer.matches || motionPreference.matches) return;

    tiltCards.forEach((card) => {
      // Avoid applying multiple event listeners.
      if (card.dataset.tiltReady === "true") return;
      card.dataset.tiltReady = "true";

      card.addEventListener("pointermove", (event) => {
        if (event.pointerType === "touch") return;

        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;

        const rotateY = (x - 0.5) * 7;
        const rotateX = (0.5 - y) * 7;

        card.style.transform =
          `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
      });

      card.addEventListener("pointerleave", () => {
        card.style.transform = "";
      });

      card.addEventListener("pointercancel", () => {
        card.style.transform = "";
      });
    });
  }

  enableTilt();

  // If the user changes their device or motion preference,
  // remove any interactive transforms that are currently applied.
  function resetTilt() {
    if (!finePointer.matches || motionPreference.matches) {
      tiltCards.forEach((card) => {
        card.style.transform = "";
      });
    }
  }

  finePointer.addEventListener?.("change", resetTilt);
  motionPreference.addEventListener?.("change", resetTilt);

  // Highlight the navigation link for the current section.
  const pageSections = document.querySelectorAll("main section[id]");

  if ("IntersectionObserver" in window) {
    const activeSectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const sectionId = entry.target.id;

          navItems.forEach((link) => {
            const isCurrent = link.getAttribute("href") === `#${sectionId}`;

            if (isCurrent) {
              link.classList.add("active");
              link.setAttribute("aria-current", "location");
            } else {
              link.classList.remove("active");
              link.removeAttribute("aria-current");
            }
          });
        });
      },
      {
        rootMargin: "-30% 0px -60% 0px",
        threshold: 0
      }
    );

    pageSections.forEach((section) => {
      activeSectionObserver.observe(section);
    });
  }

  // Back-to-top button visibility and action.
  function updateBackToTop() {
    if (!backToTop) return;

    backToTop.classList.toggle("visible", window.scrollY > 500);
  }

  window.addEventListener("scroll", updateBackToTop, {
    passive: true
  });

  updateBackToTop();

  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: reducedMotion ? "auto" : "smooth"
      });
    });
  }
});
