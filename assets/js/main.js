(() => {
  "use strict";

  const header = document.querySelector(".site-header");
  if (header) {
    const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  const revealEls = document.querySelectorAll("[data-reveal]");
  if (revealEls.length) {
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0, rootMargin: "0px 0px -10% 0px" }
      );
      revealEls.forEach((el) => io.observe(el));
    } else {
      revealEls.forEach((el) => el.classList.add("is-visible"));
    }
  }

  const navToggle = document.getElementById("navToggle");
  if (navToggle) {
    navToggle.addEventListener("click", () => {
      const open = document.body.classList.toggle("nav-open");
      navToggle.setAttribute("aria-expanded", String(open));
    });
    document.querySelectorAll(".site-nav a").forEach((a) => {
      a.addEventListener("click", () => {
        document.body.classList.remove("nav-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  document.querySelectorAll("[data-gallery]").forEach((gallery) => {
    const main = gallery.querySelector("[data-gallery-main]");
    if (!main) return;
    const mainCap = main.querySelector(".cap");
    gallery.querySelectorAll("[data-gallery-thumb]").forEach((thumb) => {
      thumb.addEventListener("click", () => {
        gallery.querySelectorAll("[data-gallery-thumb]").forEach((t) => t.classList.remove("active"));
        thumb.classList.add("active");
        const cap = thumb.querySelector(".cap");
        if (mainCap && cap) mainCap.textContent = cap.textContent;
        main.className = main.className.replace(/\b(warm|olive|steel)\b/g, "").trim();
        const tone = thumb.dataset.tone;
        if (tone) main.classList.add(tone);
      });
    });
  });

  const blogGrid = document.querySelector("[data-blog-grid]");
  if (blogGrid) {
    const tabs = document.querySelectorAll("[data-blog-filter]");
    const cards = blogGrid.querySelectorAll("[data-category]");
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        tabs.forEach((t) => t.classList.remove("on"));
        tab.classList.add("on");
        const cat = tab.dataset.blogFilter;
        cards.forEach((card) => {
          const show = cat === "all" || card.dataset.category === cat;
          card.hidden = !show;
        });
      });
    });
  }

  const contactForm = document.querySelector("[data-contact-form]");
  if (contactForm) {
    const radios = contactForm.querySelectorAll('input[name="service"]');
    const addressField = contactForm.querySelector("[data-field-address]");
    const NEEDS_ADDRESS = new Set(["kaitai", "fudousan"]);

    const syncAddress = () => {
      const checked = contactForm.querySelector('input[name="service"]:checked');
      if (addressField) addressField.hidden = !(checked && NEEDS_ADDRESS.has(checked.value));
    };

    radios.forEach((r) => r.addEventListener("change", syncAddress));

    const params = new URLSearchParams(window.location.search);
    const preset = params.get("service");
    if (preset) {
      const target = contactForm.querySelector(`input[name="service"][value="${CSS.escape(preset)}"]`);
      if (target) {
        target.checked = true;
        window.requestAnimationFrame(() => {
          contactForm.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      }
    }
    syncAddress();

    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      window.location.href = "contact.html#sent";
    });
  }
})();
