/* ==========================================================================
   SITE SETTINGS — edit these to update the site
   ========================================================================== */

// Paste the Google Form link here (the "Send" > link URL, e.g.
// "https://docs.google.com/forms/d/e/XXXX/viewform"). When set, the Google Form
// replaces the built-in estimate form. Leave empty to use the built-in form,
// which opens an email to Greg.
const GOOGLE_FORM_URL = "";

const CONTACT_EMAIL = "1drummer1@gmail.com";

// Job photos: put image files in the /images folder and list them here.
// Example: { src: "images/blue-house-after.jpg", caption: "Exterior repaint" }
const GALLERY_PHOTOS = [];

// How many placeholder tiles to show while there are no photos yet.
const PLACEHOLDER_COUNT = 6;

/* ========================================================================== */

// Mobile nav
const navToggle = document.querySelector(".nav-toggle");
const nav = document.getElementById("site-nav");

navToggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(open));
  navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

// Gallery
const grid = document.getElementById("gallery-grid");

if (GALLERY_PHOTOS.length) {
  const lightbox = document.createElement("div");
  lightbox.className = "lightbox";
  lightbox.innerHTML = '<img alt="">';
  document.body.appendChild(lightbox);
  const lightboxImg = lightbox.querySelector("img");
  lightbox.addEventListener("click", () => lightbox.classList.remove("open"));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") lightbox.classList.remove("open");
  });

  GALLERY_PHOTOS.forEach(({ src, caption = "" }) => {
    const fig = document.createElement("figure");
    const img = document.createElement("img");
    img.src = src;
    img.alt = caption || "Home painted by Redemption Painting";
    img.loading = "lazy";
    img.addEventListener("click", () => {
      lightboxImg.src = src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add("open");
    });
    fig.appendChild(img);
    if (caption) {
      const cap = document.createElement("figcaption");
      cap.textContent = caption;
      fig.appendChild(cap);
    }
    grid.appendChild(fig);
  });
} else {
  for (let i = 0; i < PLACEHOLDER_COUNT; i++) {
    const fig = document.createElement("figure");
    fig.className = "placeholder";
    fig.textContent = "Project photo coming soon";
    grid.appendChild(fig);
  }
}

// Estimate form
const formWrap = document.getElementById("quote-form-wrap");

if (GOOGLE_FORM_URL) {
  const embedUrl = GOOGLE_FORM_URL.includes("embedded=true")
    ? GOOGLE_FORM_URL
    : GOOGLE_FORM_URL + (GOOGLE_FORM_URL.includes("?") ? "&" : "?") + "embedded=true";
  formWrap.innerHTML =
    '<div class="quote-embed"><iframe title="Request a free estimate" loading="lazy"></iframe></div>';
  formWrap.querySelector("iframe").src = embedUrl;
} else {
  const form = document.getElementById("quote-form");
  const note = document.getElementById("form-note");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const name = (data.get("name") || "").trim();
    const phone = (data.get("phone") || "").trim();

    if (!name || !phone) {
      note.textContent = "Please add your name and phone number so Greg can reach you.";
      note.classList.add("error");
      return;
    }
    note.classList.remove("error");

    const services = data.getAll("service");
    const lines = [
      `Name: ${name}`,
      `Phone: ${phone}`,
      `Address: ${data.get("address") || ""}`,
      `Services: ${services.length ? services.join(", ") : "Not specified"}`,
      `Senior / Military: ${data.get("discount") ? "Yes" : "No"}`,
      "",
      `${data.get("details") || ""}`,
    ];
    const subject = `Free Estimate Request - ${name}`;
    window.location.href =
      `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
    note.textContent = "Opening your email app. If nothing happens, call or text 559-960-8613.";
  });
}

document.getElementById("year").textContent = new Date().getFullYear();
