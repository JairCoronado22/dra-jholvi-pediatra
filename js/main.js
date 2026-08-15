(() => {
  "use strict";

  const navbar = document.getElementById("mainNav");
  const navLinks = [...document.querySelectorAll(".nav-link[href^='#']")];
  const sections = [...document.querySelectorAll("main .section-anchor[id]")];
  const backToTop = document.getElementById("backToTop");
  const toast = document.getElementById("toast");
  const year = document.getElementById("currentYear");
  const navbarMenu = document.getElementById("navbarMenu");

  if (year) year.textContent = new Date().getFullYear();

  // Animaciones suaves al entrar en pantalla.
  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealElements.forEach((element) => revealObserver.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add("visible"));
  }

  // Estado del navbar y sección activa.
  let ticking = false;

  function updateOnScroll() {
    const scrollY = window.scrollY;

    navbar?.classList.toggle("scrolled", scrollY > 18);
    backToTop?.classList.toggle("visible", scrollY > 650);

    let currentId = "inicio";
    sections.forEach((section) => {
      if (scrollY >= section.offsetTop - 145) currentId = section.id;
    });

    navLinks.forEach((link) => {
      link.classList.toggle(
        "active",
        link.getAttribute("href") === `#${currentId}`
      );
    });

    ticking = false;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        window.requestAnimationFrame(updateOnScroll);
        ticking = true;
      }
    },
    { passive: true }
  );

  updateOnScroll();

  // Cierra el menú móvil al seleccionar una opción.
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (!navbarMenu || !navbarMenu.classList.contains("show")) return;

      const instance = bootstrap.Collapse.getOrCreateInstance(navbarMenu);
      instance.hide();
    });
  });

  backToTop?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Copiar número de contacto.
  let toastTimer;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 1700);
  }

  async function copyText(value) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(value);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = value;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        const ok = document.execCommand("copy");
        textarea.remove();
        if (!ok) throw new Error("No se pudo copiar");
      }
      return true;
    } catch {
      window.prompt("Copia este número:", value);
      return false;
    }
  }

  document.querySelectorAll("[data-copy]").forEach((button) => {
    button.addEventListener("click", async () => {
      const value = button.dataset.copy;
      if (!value) return;

      const copied = await copyText(value);
      if (copied) {
        button.classList.add("copied");
        showToast("Número copiado");
        setTimeout(() => button.classList.remove("copied"), 1400);
      }
    });
  });


  // Galería fotográfica de atención.
  const careGalleryModalElement = document.getElementById("careGalleryModal");
  const careGalleryCarouselElement = document.getElementById("careGalleryCarousel");

  if (careGalleryModalElement && careGalleryCarouselElement) {
    const careGalleryModal = bootstrap.Modal.getOrCreateInstance(careGalleryModalElement);
    const careGalleryCarousel = bootstrap.Carousel.getOrCreateInstance(
      careGalleryCarouselElement,
      {
        interval: false,
        touch: true,
        keyboard: true,
        wrap: true,
      }
    );

    document.querySelectorAll("[data-care-gallery]").forEach((button) => {
      button.addEventListener("click", () => {
        const requestedIndex = Number.parseInt(button.dataset.careGallery ?? "0", 10);
        const slideIndex = Number.isNaN(requestedIndex) ? 0 : requestedIndex;

        careGalleryCarousel.to(slideIndex);
        careGalleryModal.show();
      });
    });
  }

  // Modal para ampliar el material de vacunas.
  const galleryModalElement = document.getElementById("galleryModal");
  const galleryImage = document.getElementById("galleryImage");

  if (galleryModalElement && galleryImage) {
    const galleryModal = new bootstrap.Modal(galleryModalElement);

    document.querySelectorAll("[data-gallery]").forEach((button) => {
      button.addEventListener("click", () => {
        const image = button.dataset.gallery;
        if (!image) return;
        galleryImage.src = image;
        galleryModal.show();
      });
    });

    galleryModalElement.addEventListener("hidden.bs.modal", () => {
      galleryImage.src = "";
    });
  }
})();
