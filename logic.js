/* ============================================================
   TASK1 – logic.js
   Handles: scroll navbar, active section highlight, mobile menu
   ============================================================ */

(function () {
  "use strict";

  /* ---------- Element refs ---------- */
  const navbar     = document.getElementById("navbar");
  const navLinks   = document.querySelectorAll(".nav-link");
  const sections   = document.querySelectorAll(".full-section");
  const hamburger  = document.getElementById("hamburger");
  const navMenu    = document.getElementById("nav-links");

  /* ============================================================
     1. SCROLL → navbar background change
     ============================================================ */
  function onScroll() {
    if (!navbar) return;

    /* Toggle .scrolled class based on scroll position */
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }

    /* Also update the active nav link */
    highlightActiveSection();
  }

  window.addEventListener("scroll", onScroll, { passive: true });

  /* ============================================================
     2. ACTIVE SECTION HIGHLIGHTING (IntersectionObserver)
        Uses a 55% threshold – section must be more than half
        visible before its link gets highlighted.
     ============================================================ */
  const observerOptions = {
    root      : null,
    rootMargin: "0px",
    threshold : 0.45,          // 45% of the section visible
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.id;            // e.g. "about"
        setActiveLink(id);
      }
    });
  }, observerOptions);

  sections.forEach((section) => sectionObserver.observe(section));

  /* Fallback scroll-based active detection (for older browsers) */
  function highlightActiveSection() {
    let currentId = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 80;
      if (window.scrollY >= sectionTop) {
        currentId = section.id;
      }
    });
    if (currentId) setActiveLink(currentId);
  }

  function setActiveLink(id) {
    navLinks.forEach((link) => {
      link.classList.toggle("active", link.dataset.section === id);
    });
  }

  /* ============================================================
     3. SMOOTH SCROLL on nav link click
        (html { scroll-behavior: smooth } handles most cases,
         but this also closes the mobile menu on click.)
     ============================================================ */
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href"); // e.g. "#home"
      const target   = document.querySelector(targetId);

      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }

      /* Close mobile menu if open */
      closeMobileMenu();
    });
  });

  /* ============================================================
     4. MOBILE HAMBURGER MENU TOGGLE
     ============================================================ */
  if (hamburger) {
    hamburger.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("open");
      hamburger.classList.toggle("open", isOpen);
      hamburger.setAttribute("aria-expanded", isOpen);

      /* Prevent body scroll when menu is open */
      document.body.style.overflow = isOpen ? "hidden" : "";
    });
  }

  function closeMobileMenu() {
    navMenu.classList.remove("open");
    hamburger.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  /* Close menu if user clicks outside of it */
  document.addEventListener("click", (e) => {
    if (
      navMenu.classList.contains("open") &&
      !navMenu.contains(e.target) &&
      !hamburger.contains(e.target)
    ) {
      closeMobileMenu();
    }
  });

  /* Run once on page load to set correct initial state */
  onScroll();
})();
