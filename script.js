/* ==========================================================================
   SITE SETTINGS — edit these to update the site
   ========================================================================== */

// Paste the Google Form link here (the "Send" > link URL, e.g.
// "https://docs.google.com/forms/d/e/XXXX/viewform"). When set, the Google Form
// replaces the built-in estimate form. Leave empty to use the built-in form,
// which opens an email to Greg.
const GOOGLE_FORM_URL = "";

const CONTACT_EMAIL = "1drummer1@gmail.com";

// Job photos live in images/work (full size) and images/work/thumbs (grid size).
// To add one: process it to both folders, then add a line here.
// Categories: exterior, interior, cabinets, washing
const GALLERY_PHOTOS = [
  { file: "white-house-front", cat: "exterior", caption: "Stucco & siding, black trim" },
  { file: "white-stucco-black-trim", cat: "exterior", caption: "White stucco with black trim" },
  { file: "cottage-after", cat: "exterior", caption: "Cottage exterior repaint" },
  { file: "gray-stucco-two-story", cat: "exterior", caption: "Two-tone stucco & garage doors" },
  { file: "gray-craftsman", cat: "exterior", caption: "Craftsman siding & trim" },
  { file: "white-house-porch", cat: "exterior", caption: "Porch rails & trim" },
  { file: "stucco-two-story", cat: "exterior", caption: "Stucco & shutters" },
  { file: "craftsman-windows", cat: "exterior", caption: "Window sash & trim detail" },
  { file: "cream-ranch-gable", cat: "exterior", caption: "Stucco & fascia" },
  { file: "white-garage", cat: "exterior", caption: "Garage & trim" },
  { file: "cream-ranch-front", cat: "exterior", caption: "Ranch exterior" },
  { file: "cottage-side", cat: "exterior", caption: "Siding, trim & utilities" },
  { file: "brick-fireplace", cat: "interior", caption: "Painted brick fireplace" },
  { file: "staircase", cat: "interior", caption: "Two-tone staircase" },
  { file: "striped-bedroom", cat: "interior", caption: "Striped accent walls" },
  { file: "sage-bedroom", cat: "interior", caption: "Bedroom walls" },
  { file: "dark-vanity-bath", cat: "interior", caption: "Bathroom walls & vanity" },
  { file: "white-vanity-bath", cat: "interior", caption: "Bathroom walls & trim" },
  { file: "charcoal-kitchen", cat: "cabinets", caption: "Charcoal kitchen cabinets" },
  { file: "charcoal-kitchen-2", cat: "cabinets", caption: "Cabinets & island" },
  { file: "glazed-cabinets", cat: "cabinets", caption: "Glazed cabinet finish" },
  { file: "fence-stain-half", cat: "washing", caption: "Fence restoration: before & after" },
  { file: "driveway-cleaning", cat: "washing", caption: "Driveway pressure washing" },
  { file: "stained-gate", cat: "washing", caption: "Washed & stained gate" },
  { file: "stained-fence", cat: "washing", caption: "Fence stain" },
];

// Before & after pairs shown side by side
const BEFORE_AFTER = [
  { before: "cottage-before", after: "cottage-after", caption: "Cottage exterior" },
  { before: "sunroom-before", after: "sunroom-after", caption: "Sunroom walls, trim & floor" },
  { before: "coffee-table-before", after: "coffee-table-after", caption: "Coffee table refinish" },
  { before: "hall-bench-before", after: "hall-bench-after", caption: "Hall bench refinish" },
];

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

// Lightbox
const lightbox = document.createElement("div");
lightbox.className = "lightbox";
lightbox.innerHTML = '<img alt="">';
document.body.appendChild(lightbox);
const lightboxImg = lightbox.querySelector("img");
lightbox.addEventListener("click", () => lightbox.classList.remove("open"));
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") lightbox.classList.remove("open");
});

function photoFigure(file, caption, label) {
  const fig = document.createElement("figure");
  const img = document.createElement("img");
  img.src = `images/work/thumbs/${file}.jpg`;
  img.alt = caption ? `${caption} by Redemption Painting` : "Work by Redemption Painting";
  img.loading = "lazy";
  img.addEventListener("click", () => {
    lightboxImg.src = `images/work/${file}.jpg`;
    lightboxImg.alt = img.alt;
    lightbox.classList.add("open");
  });
  fig.appendChild(img);
  if (label) {
    const tag = document.createElement("span");
    tag.className = "ba-tag";
    tag.textContent = label;
    fig.appendChild(tag);
  }
  if (caption) {
    const cap = document.createElement("figcaption");
    cap.textContent = caption;
    fig.appendChild(cap);
  }
  return fig;
}

// Gallery
const grid = document.getElementById("gallery-grid");
GALLERY_PHOTOS.forEach(({ file, cat, caption }) => {
  const fig = photoFigure(file, caption);
  fig.dataset.cat = cat;
  grid.appendChild(fig);
});

// "All" shows the first few photos until "View all" is clicked
const PREVIEW_COUNT = 9;
let currentFilter = "all";
let expanded = false;
const moreBtn = document.createElement("button");
moreBtn.className = "btn btn-primary gallery-more";
moreBtn.textContent = `View all ${GALLERY_PHOTOS.length} photos`;
grid.after(moreBtn);
moreBtn.addEventListener("click", () => {
  expanded = true;
  applyFilter();
});

function applyFilter() {
  let shown = 0;
  grid.querySelectorAll("figure").forEach((fig) => {
    const match = currentFilter === "all" || fig.dataset.cat === currentFilter;
    const visible = match && (currentFilter !== "all" || expanded || shown < PREVIEW_COUNT);
    fig.hidden = !visible;
    if (visible) shown++;
  });
  moreBtn.hidden = currentFilter !== "all" || expanded;
}

document.querySelectorAll("#gallery-filters .filter").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll("#gallery-filters .filter").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    applyFilter();
  });
});
applyFilter();

// Before & after
const baList = document.getElementById("ba-list");
BEFORE_AFTER.forEach(({ before, after, caption }) => {
  const pair = document.createElement("div");
  pair.className = "ba-pair";
  pair.appendChild(photoFigure(before, "", "Before"));
  pair.appendChild(photoFigure(after, "", "After"));
  const cap = document.createElement("p");
  cap.className = "ba-caption";
  cap.textContent = caption;
  pair.appendChild(cap);
  baList.appendChild(pair);
});

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
