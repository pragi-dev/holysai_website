// Holy Sai Preparatory School — shared site interactions (runs on every page)
document.documentElement.classList.add("js"); // animations only run when JS is on

document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("header");
  const nav = document.getElementById("nav");
  const navToggle = document.getElementById("navToggle");
  const backToTop = document.getElementById("backToTop");

  // Footer year
  document.getElementById("year").textContent = new Date().getFullYear();

  // ----- Mobile menu -----
  const closeMenu = () => {
    nav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
  };
  navToggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });
  nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") { closeMenu(); closeMore(); closeLightbox(); } });

  // ----- "More" dropdown (click/tap support; hover handled in CSS) -----
  const more = document.querySelector(".nav-more");
  const moreBtn = more && more.querySelector(".nav-more-btn");
  function closeMore() {
    if (!more) return;
    more.classList.remove("open");
    moreBtn.setAttribute("aria-expanded", "false");
  }
  if (more) {
    moreBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const open = more.classList.toggle("open");
      moreBtn.setAttribute("aria-expanded", String(open));
    });
    document.addEventListener("click", (e) => { if (!more.contains(e.target)) closeMore(); });
  }

  // ----- Header shadow + back-to-top -----
  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle("scrolled", y > 100);
    backToTop.classList.toggle("show", y > 600);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // ----- Entrance animations (same styles as the current Holy Sai site) -----
  // Each element type gets its own entrance; items in grids are staggered 100ms apart.
  const animRules = [
    [".section-head", "fade-down"],
    [".mvm2-intro", "fade-left"],
    [".activities-head", "fade-down"],
    [".about-visual", "fade-left"],
    [".about-grid > .reveal:not(.about-visual)", "fade-right"],
    [".admissions-grid > .reveal:not(.form)", "fade-left"],
    [".form", "fade-right"],
    [".contact-grid > .reveal:not(.map)", "fade-left"],
    [".map", "zoom-in"],
    [".career-grid > .reveal:not(.career-card)", "fade-left"],
    [".career-card", "fade-right"],
    [".message", "zoom-in"],
    [".cta-inner", "zoom-in"],
    [".post-cover", "zoom-in"], [".post-featured", "fade-up"],
  ];
  const staggerGroups = [
    [".cards-4 > *", "fade-up"], [".facilities > *", "fade-up"], [".explore > *", "fade-up"],
    [".news > *", "fade-up"], [".months > *", "fade-up"], [".post-grid > *", "fade-up"],
    [".leaders > *", "fade-up"], [".timeline > li", "fade-left"], [".faq details", "fade-up"],
    [".stats-grid > .stat", "fade-up"], [".gallery > .tile", "zoom-in"], [".chips > li", "pop"], [".activity-bento > .act", "zoom-in"],
    [".photo-grid > .tile", "zoom-in"], [".campus-photos > *", "zoom-in"], [".gallery-filters > .chip", "pop"],
    [".post-aside > *", "fade-left"], [".post-nav > a", "fade-up"],
    [".mvm2-list > *", "fade-right"],
  ];
  const tag = (el, anim, delayMs) => {
    el.classList.add("reveal");
    el.dataset.anim = anim;
    if (delayMs) el.style.setProperty("--delay", delayMs / 1000 + "s");
  };
  animRules.forEach(([sel, anim]) => document.querySelectorAll(sel).forEach((el) => tag(el, anim, 0)));
  staggerGroups.forEach(([sel, anim]) => {
    const groups = new Map();
    document.querySelectorAll(sel).forEach((el) => {
      if (!groups.has(el.parentElement)) groups.set(el.parentElement, []);
      groups.get(el.parentElement).push(el);
    });
    groups.forEach((items) => items.forEach((el, i) => tag(el, anim, (i % 6) * 100)));
  });
  // The "Since 2007" badge spins in after the photo (rotateInDownRight, as on the old site).
  document.querySelectorAll(".about-badge").forEach((el) => tag(el, "rotate-in", 700));
  // A wrapper whose children animate on their own shouldn't also be hidden.
  document.querySelectorAll(".reveal:not([data-anim])").forEach((el) => {
    if (el.querySelector(".reveal")) el.classList.remove("reveal");
  });
  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add("visible"); obs.unobserve(entry.target); }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));
  // Once an entrance animation finishes, release it so hover effects (lift, tilt) work again.
  const ENTRANCES = ["fadeInUp", "fadeInDown", "fadeInLeft", "fadeInRight", "zoomIn", "rotateInDownRight", "popIn"];
  document.addEventListener("animationend", (e) => {
    const el = e.target;
    if (el.classList && el.classList.contains("reveal") && ENTRANCES.includes(e.animationName)) el.classList.add("anim-done");
  });

  // ----- Floating particles in the banners -----
  // [shape class, left %, top %]
  const particleSets = {
    ".hero": [["p-blob", 70, 5], ["p-ring", 8, 72], ["p-dot", 46, 18], ["p-plus", 90, 70], ["p-tri", 55, 82], ["p-dots", 3, 12], ["p-square", 38, 60], ["p-dot", 82, 40]],
    ".page-hero": [["p-blob", 75, -20], ["p-ring", 6, 30], ["p-plus", 88, 60], ["p-dot", 20, 75], ["p-tri", 70, 70], ["p-dots", 85, 10]],
    ".cta": [["p-ring", 92, 15], ["p-dot", 5, 70], ["p-plus", 48, 12]],
    ".section-dark": [["p-ring", 94, 10], ["p-dots", 2, 70], ["p-square", 50, 85]],
  };
  Object.entries(particleSets).forEach(([sel, items]) => {
    document.querySelectorAll(sel).forEach((host) => {
      const layer = document.createElement("div");
      layer.className = "particles";
      layer.setAttribute("aria-hidden", "true");
      items.forEach(([cls, left, top], i) => {
        const p = document.createElement("span");
        p.className = cls;
        p.style.left = left + "%";
        p.style.top = top + "%";
        p.style.animationDelay = -i * 1.3 + "s";
        layer.appendChild(p);
      });
      host.prepend(layer);
    });
  });

  // ----- Animated counters -----
  const countObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = Number(el.dataset.count);
      const start = performance.now();
      const duration = 1600;
      const tick = (now) => {
        const p = Math.min((now - start) / duration, 1);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))).toLocaleString("en-IN");
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll("[data-count]").forEach((el) => countObserver.observe(el));

  // ----- Gallery: album filters + lightbox with previous / next -----
  const lightbox = document.getElementById("lightbox");
  const lbImg = document.getElementById("lightboxImg");
  const lbCaption = document.getElementById("lightboxCaption");
  let lastFocus = null;
  let current = -1;
  const visibleTiles = () => [...document.querySelectorAll(".tile")].filter((t) => !t.hidden);
  function showTile(i) {
    const tiles = visibleTiles();
    if (!tiles.length) return;
    current = (i + tiles.length) % tiles.length;
    const tile = tiles[current];
    const img = tile.querySelector("img");
    lbImg.src = img.currentSrc || img.src;
    lbImg.alt = img.alt;
    lbCaption.textContent = `${tile.dataset.caption}  ·  ${current + 1} / ${tiles.length}`;
  }
  function closeLightbox() {
    if (!lightbox || lightbox.hidden) return;
    lightbox.hidden = true;
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  }
  document.querySelectorAll(".tile").forEach((tile) => {
    tile.addEventListener("click", () => {
      lastFocus = tile;
      showTile(visibleTiles().indexOf(tile));
      lightbox.hidden = false;
      document.body.style.overflow = "hidden";
      lightbox.querySelector(".lightbox-close").focus();
    });
  });
  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
      if (e.target.closest(".lightbox-prev")) return showTile(current - 1);
      if (e.target.closest(".lightbox-next")) return showTile(current + 1);
      if (e.target === lightbox || e.target.classList.contains("lightbox-close")) closeLightbox();
    });
    document.addEventListener("keydown", (e) => {
      if (lightbox.hidden) return;
      if (e.key === "ArrowLeft") showTile(current - 1);
      if (e.key === "ArrowRight") showTile(current + 1);
    });
    // Swipe on phones
    let touchX = null;
    lightbox.addEventListener("touchstart", (e) => { touchX = e.touches[0].clientX; }, { passive: true });
    lightbox.addEventListener("touchend", (e) => {
      if (touchX === null) return;
      const dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 50) showTile(current + (dx < 0 ? 1 : -1));
      touchX = null;
    });
  }

  const chips = document.querySelectorAll("#gallery [data-filter]");
  const countEl = document.getElementById("galleryCount");
  function applyFilter(filter) {
    let n = 0;
    document.querySelectorAll(".photo-grid .tile").forEach((t) => {
      const show = filter === "all" || t.dataset.album === filter;
      t.hidden = !show;
      if (show) n++;
    });
    chips.forEach((c) => c.classList.toggle("active", c.dataset.filter === filter));
    if (countEl) countEl.textContent = `${n} photo${n === 1 ? "" : "s"}`;
    // Album shelf: "Now viewing" bar + mosaic sizes on the visible photos
    const active = [...chips].find((c) => c.dataset.filter === filter);
    const nv = document.getElementById("nvName");
    if (nv && active) nv.textContent = active.querySelector("b") ? active.querySelector("b").textContent : active.textContent;
    const reset = document.getElementById("nvReset");
    if (reset) reset.hidden = filter === "all";
    if (active && active.closest(".album-track") && !active.closest(".is-marquee")) {
      const track = active.closest(".album-track");
      const delta = active.getBoundingClientRect().left - track.getBoundingClientRect().left - 16;
      track.scrollBy({ left: delta, behavior: "smooth" });
    }
    let i = 0;
    document.querySelectorAll(".photo-grid .tile").forEach((t) => {
      t.classList.remove("t-big", "t-wide", "t-tall");
      if (t.hidden) return;
      const k = i % 10;
      if (k === 0) t.classList.add("t-big");
      else if (k === 5) t.classList.add("t-wide");
      else if (k === 7) t.classList.add("t-tall");
      i++;
    });
  }
  chips.forEach((chip) => chip.addEventListener("click", () => {
    applyFilter(chip.dataset.filter);
    history.replaceState(null, "", chip.dataset.filter === "all" ? location.pathname : "#" + chip.dataset.filter);
  }));

  // Album shelf: year tabs, arrows, reset, initial mosaic
  const ytabs = document.querySelectorAll(".ytab");
  ytabs.forEach((tab) => tab.addEventListener("click", () => {
    const y = tab.dataset.year;
    ytabs.forEach((t) => t.classList.toggle("active", t === tab));
    document.querySelectorAll(".album-card").forEach((c) => {
      c.hidden = !(y === "all" || c.dataset.year === y || c.dataset.year === "all");
    });
    const track = document.querySelector(".album-track");
    if (track) track.scrollTo({ left: 0, behavior: "smooth" });
  }));
  document.querySelectorAll(".shelf-btn").forEach((b) => b.addEventListener("click", () => {
    const track = document.querySelector(".album-track");
    track.scrollBy({ left: Number(b.dataset.dir) * track.clientWidth * 0.8, behavior: "smooth" });
  }));
  const nvReset = document.getElementById("nvReset");
  if (nvReset) nvReset.addEventListener("click", () => {
    applyFilter("all");
    history.replaceState(null, "", location.pathname);
  });
  if (document.querySelector(".album-track")) {
    applyFilter("all");
    window.addEventListener("hashchange", () => {
      const w = decodeURIComponent(location.hash.slice(1));
      if ([...chips].some((c) => c.dataset.filter === w)) {
        applyFilter(w);
        const shelf = document.querySelector(".album-shelf");
        if (shelf) shelf.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }
  // Links like gallery.html#onam open straight to that album
  if (chips.length && location.hash) {
    const wanted = decodeURIComponent(location.hash.slice(1));
    if ([...chips].some((c) => c.dataset.filter === wanted)) applyFilter(wanted);
  }

  // ----- Blog article share buttons -----
  document.querySelectorAll("[data-share]").forEach((btn) => {
    const url = location.href.split("#")[0];
    const title = document.querySelector("h1")?.textContent.trim() || document.title;
    if (btn.dataset.share === "whatsapp") btn.href = "https://wa.me/?text=" + encodeURIComponent(title + " " + url);
    if (btn.dataset.share === "facebook") btn.href = "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(url);
    if (btn.dataset.share === "copy") {
      btn.addEventListener("click", async () => {
        try { await navigator.clipboard.writeText(url); btn.textContent = "Link copied ✓"; }
        catch { btn.textContent = "Copy failed"; }
        setTimeout(() => (btn.textContent = "Copy link"), 2000);
      });
    }
  });

  // ===================== Scrolling effects =====================
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Reading progress bar at the very top
  const progress = document.createElement("div");
  progress.className = "scroll-progress";
  progress.setAttribute("aria-hidden", "true");
  document.body.appendChild(progress);

  // Page banners: photo background from data-bg
  document.querySelectorAll(".page-hero[data-bg]").forEach((hero) => {
    const bg = document.createElement("div");
    bg.className = "banner-bg parallax-img";
    bg.style.backgroundImage = `url("${hero.dataset.bg}")`;
    hero.prepend(bg);
    hero.setAttribute("data-parallax", "");
  });

  // Parallax: photos move slower than the page
  const parallaxEls = [...document.querySelectorAll("[data-parallax]")];
  function updateScrollEffects() {
    const doc = document.documentElement;
    const max = doc.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
    if (reduceMotion) return;
    parallaxEls.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      const offset = (r.top + r.height / 2 - innerHeight / 2) * -0.25;
      const img = el.querySelector(":scope > .parallax-img");
      if (img) img.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0) scale(1.25)`;
    });
  }
  let ticking = false;
  window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { updateScrollEffects(); ticking = false; });
  }, { passive: true });
  window.addEventListener("resize", updateScrollEffects);
  updateScrollEffects();

  // Home banner photo slideshow (cross-fade with slow zoom)
  document.querySelectorAll(".hero-slides").forEach((wrap) => {
    const slides = [...wrap.querySelectorAll("img")];
    if (slides.length < 2 || reduceMotion) return;
    let i = 0;
    setInterval(() => {
      slides[i].classList.remove("active");
      i = (i + 1) % slides.length;
      slides[i].loading = "eager";
      slides[i].classList.add("active");
    }, 5000);
  });

  // Endless photo rows: copy each row once so it can loop without a gap
  document.querySelectorAll(".marquee-track").forEach((track) => {
    [...track.children].forEach((item) => {
      const clone = item.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      clone.setAttribute("tabindex", "-1");
      track.appendChild(clone);
    });
  });

  // ----- Enquiry form validation -----
  const form = document.getElementById("enquiryForm");
  if (!form) return; // only the Admissions page has the form
  const success = document.getElementById("formSuccess");
  const rules = {
    name: (v) => v.trim().length >= 2 || "Please enter your name.",
    phone: (v) => /^[6-9]\d{9}$/.test(v.replace(/[\s-]/g, "").replace(/^(\+91|0)/, "")) || "Enter a valid 10-digit mobile number.",
    grade: (v) => v !== "" || "Please select a grade.",
    email: (v) => v === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || "Enter a valid email address.",
  };
  const validateField = (name) => {
    const input = form.elements[name];
    const result = rules[name](input.value);
    const field = input.closest(".field");
    const msg = result === true ? "" : result;
    field.classList.toggle("invalid", !!msg);
    field.querySelector(".error").textContent = msg;
    return !msg;
  };
  Object.keys(rules).forEach((name) => {
    form.elements[name].addEventListener("blur", () => validateField(name));
  });
  // Where enquiries are sent. Empty = not connected yet: visitors are asked to call instead.
  // To connect later (see README), e.g. FormSubmit: "https://formsubmit.co/ajax/<school-email>"
  const FORM_ENDPOINT = "";
  const errorBox = document.getElementById("formError");
  const notice = document.getElementById("formNotice");
  const submitBtn = document.getElementById("enquirySubmit");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    success.hidden = true;
    errorBox.hidden = true;
    notice.hidden = true;
    const allValid = Object.keys(rules).map(validateField).every(Boolean);
    if (!allValid) {
      form.querySelector(".invalid input, .invalid select")?.focus();
      return;
    }
    if (form.elements._honey.value) return; // a bot filled the hidden spam trap
    if (!FORM_ENDPOINT) {
      // Not connected to email yet — don't pretend it was sent; keep their details and ask them to call.
      notice.hidden = false;
      return;
    }

    const data = Object.fromEntries(new FormData(form));
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending…";
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || String(json.success) !== "true") throw new Error(json.message || res.statusText);
      form.reset();
      success.hidden = false;
    } catch (err) {
      console.error("Enquiry not sent:", err);
      errorBox.hidden = false;
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Send Enquiry";
    }
  });
});


/* ---------- v3 · News & Events: category chips + search ---------- */
(function () {
  const chipsBox = document.getElementById("newsChips");
  const search = document.getElementById("newsSearch");
  if (!chipsBox || !search) return;
  const chips = chipsBox.querySelectorAll(".chip");
  const cards = document.querySelectorAll(".ncard");
  const items = document.querySelectorAll(".nitem");
  const folds = document.querySelectorAll(".mfold");
  const empty = document.getElementById("newsEmpty");
  let cat = "all";

  function apply() {
    const q = search.value.trim().toLowerCase();
    const filtering = cat !== "all" || q !== "";
    let shown = 0;
    const match = (el) => (cat === "all" || el.dataset.cat === cat) && (!q || el.textContent.toLowerCase().includes(q));
    cards.forEach((c) => { const ok = match(c); c.hidden = !ok; if (ok) shown++; });
    folds.forEach((f, i) => {
      let n = 0;
      f.querySelectorAll(".nitem").forEach((it) => { const ok = match(it); it.hidden = !ok; if (ok) n++; });
      f.hidden = n === 0;
      f.open = filtering ? n > 0 : i === 0;
      shown += n;
    });
    if (empty) empty.hidden = shown > 0;
  }
  function setCat(c) {
    cat = c;
    chips.forEach((b) => b.classList.toggle("active", b.dataset.cat === c));
    apply();
  }
  chips.forEach((b) => b.addEventListener("click", () => setCat(b.dataset.cat)));
  search.addEventListener("input", apply);
  document.querySelectorAll("[data-chip]").forEach((a) => a.addEventListener("click", (e) => {
    e.preventDefault();
    setCat(a.dataset.chip);
    chipsBox.scrollIntoView({ behavior: "smooth", block: "center" });
  }));
})();


/* ---------- v3 · Holy Sai Assistant (scripted, offline — answers from site content only) ---------- */
(function () {
  const logo = document.querySelector(".brand-img");
  if (!logo) return;
  const base = logo.getAttribute("src").replace(/assets\/images\/logo\.png$/, "");
  const link = (href, text) => `<a href="${base}${href}">${text} →</a>`;
  const PHONE = '<a href="tel:+919940430003">+91 99404 30003</a>';

  const TOPICS = [
    { id: "admissions", label: "Admissions & Fees", keys: ["admission", "fee", "fees", "apply", "seat", "join", "enrol", "enroll"],
      answer: () => `Admissions are open for <b>2027–28</b>, <b>Pre KG – Grade IX</b>, from <b>14 November</b>.<br>For fee details, please call ${PHONE} or send an enquiry.<br>${link("admissions.html", "Admission enquiry")}` },
    { id: "grades", label: "Grades & Curriculum", keys: ["grade", "class", "curriculum", "syllabus", "kg", "kindergarten", "primary", "middle", "academic", "subject"],
      card: true,
      answer: () => `Holy Sai offers a continuous journey from Pre KG to Grade IX:<div class="hs-card"><b>Pre KG to Grade IX</b><span>Kindergarten (Pre KG – Sr KG) · Primary (I – V) · Middle School (VI – VIII) · Grade IX</span><small>Creative, collaborative, unpressurised learning</small></div>${link("academics.html", "Explore academics")}` },
    { id: "events", label: "Upcoming Events", keys: ["event", "news", "celebration", "holiday", "calendar", "trip"],
      answer: () => `Recent highlights include <b>Spotlight &amp; Kindergarten Graduation</b> (28 Mar 2026), field trips to the Children’s Traffic Park and splash pool activities (Feb 2026).<br>${link("events.html", "See News & Events")}` },
    { id: "visit", label: "Book a Campus Visit", keys: ["visit", "tour", "campus", "address", "location", "where", "map", "direction"],
      answer: () => `We’d love to show you around! 📍 <b>Thondamuthur Road, Vadavalli, Coimbatore 641041</b><br>Open Mon – Sat, 9 AM – 5 PM. Call ${PHONE} to fix a time.<br>${link("contact.html", "Contact & map")}` },
    { id: "facilities", label: "Facilities", keys: ["facilit", "lab", "library", "auditorium", "classroom", "sport", "play", "wifi"],
      answer: () => `Air-conditioned classrooms, Science, IT &amp; English labs, a 200-seat auditorium, kids play zone, basketball court, digital learning and a Wi-Fi library.<br>${link("facilities.html", "See facilities")}` },
    { id: "safety", label: "Transport & Safety", keys: ["transport", "bus", "van", "safety", "safe", "cctv", "medical", "doctor", "gps"],
      answer: () => `GPS-tracked buses with experienced drivers and attenders, CCTV across campus, a sickbay with a medical assistant, regular health check-ups, and visitors by appointment only.<br>${link("facilities.html", "Safety details")}` },
    { id: "office", label: "Talk to our office", keys: ["call", "phone", "contact", "email", "office", "talk", "human", "person", "number"],
      answer: () => `📞 ${PHONE}<br>✉️ <a href="mailto:info@holysaiprepschool.org.in">info@holysaiprepschool.org.in</a><br>🕘 Mon – Sat, 9 AM – 5 PM` },
  ];
  const QUICK = ["admissions", "grades", "events", "visit", "office"];
  const FALLBACK = () => `I can help with admissions, grades, events, facilities, transport &amp; safety, or visiting the campus. For anything else, please call ${PHONE}.`;

  const wrap = document.createElement("div");
  wrap.className = "hs-chat";
  wrap.innerHTML = `
    <div class="hs-teaser" role="status"><button class="hs-teaser-x" aria-label="Dismiss">×</button>
      <p>👋 Hi! Need help with <b>admissions</b> or <b>academics</b>?</p><small>Holy Sai Assistant · <span>Online</span></small></div>
    <button class="hs-launch" aria-label="Open the Holy Sai Assistant" aria-expanded="false"><img src="${base}assets/images/logo.png" alt="" /><span class="hs-dot"></span></button>
    <section class="hs-panel" aria-label="Holy Sai Assistant" hidden>
      <header class="hs-head"><img src="${base}assets/images/logo.png" alt="" />
        <div><strong>Holy Sai Assistant <i class="hs-online"></i></strong><small>Typically replies instantly · <em>Admissions desk</em></small></div>
        <button class="hs-close" aria-label="Close chat">×</button></header>
      <div class="hs-log" aria-live="polite"><p class="hs-day">Today · Admissions help desk</p></div>
      <p class="hs-foot"><span>● Vadavalli Campus · Pre KG to Grade IX</span><span>Mon – Sat, 9 – 5</span></p>
      <form class="hs-form"><input type="text" placeholder="Type your question…" aria-label="Type your question" maxlength="200" /><button aria-label="Send">➤</button></form>
    </section>`;
  document.body.appendChild(wrap);

  const panel = wrap.querySelector(".hs-panel");
  const launch = wrap.querySelector(".hs-launch");
  const teaser = wrap.querySelector(".hs-teaser");
  const log = wrap.querySelector(".hs-log");
  const form = wrap.querySelector(".hs-form");
  const input = form.querySelector("input");
  let started = false;

  const time = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const esc = (s) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const scroll = () => { log.scrollTop = log.scrollHeight; };

  function bot(html, label) {
    const typing = document.createElement("div");
    typing.className = "hs-msg hs-bot hs-typing";
    typing.innerHTML = `<img src="${base}assets/images/logo.png" alt="" /><div class="hs-bubble"><span></span><span></span><span></span></div>`;
    log.appendChild(typing); scroll();
    setTimeout(() => {
      typing.classList.remove("hs-typing");
      typing.querySelector(".hs-bubble").innerHTML = (label ? `<p class="hs-label">${label}</p>` : "") + html;
      scroll();
    }, 650);
  }
  function user(text) {
    const m = document.createElement("div");
    m.className = "hs-msg hs-user";
    m.innerHTML = `<div class="hs-bubble">${esc(text)}</div><small>${time()} · Delivered</small>`;
    log.appendChild(m); scroll();
  }
  function quick() {
    const q = document.createElement("div");
    q.className = "hs-quick";
    QUICK.forEach((id) => {
      const t = TOPICS.find((x) => x.id === id);
      const b = document.createElement("button");
      b.type = "button"; b.textContent = t.label;
      b.addEventListener("click", () => ask(t.label, t));
      q.appendChild(b);
    });
    log.appendChild(q); scroll();
  }
  function ask(text, topic) {
    user(text);
    const t = topic || TOPICS.find((x) => x.keys.some((k) => text.toLowerCase().includes(k)));
    bot(t ? t.answer() : FALLBACK());
  }
  function open() {
    panel.hidden = false; teaser.hidden = true;
    launch.setAttribute("aria-expanded", "true"); wrap.classList.add("is-open");
    if (!started) {
      started = true;
      bot("Welcome to Holy Sai Preparatory School! How can I help you today?", "Namaste &amp; welcome");
      setTimeout(quick, 700);
    }
    setTimeout(() => input.focus(), 50);
  }
  function close() { panel.hidden = true; launch.setAttribute("aria-expanded", "false"); wrap.classList.remove("is-open"); }

  launch.addEventListener("click", () => (panel.hidden ? open() : close()));
  teaser.addEventListener("click", (e) => { if (!e.target.closest(".hs-teaser-x")) open(); });
  wrap.querySelector(".hs-teaser-x").addEventListener("click", () => { teaser.hidden = true; });
  wrap.querySelector(".hs-close").addEventListener("click", close);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !panel.hidden) close(); });
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const v = input.value.trim();
    if (!v) return;
    input.value = "";
    ask(v);
  });
  teaser.hidden = true;
  setTimeout(() => { if (panel.hidden) teaser.hidden = false; }, 2500);
})();


/* ---------- v3 · Gallery side panel: album search, phone toggle, slideshow ---------- */
(function () {
  const side = document.querySelector(".gal-side");
  if (!side) return;
  const main = document.querySelector(".gal-main");
  const search = document.getElementById("albumSearch");
  const none = document.getElementById("sideNone");

  // Album search
  if (search) search.addEventListener("input", () => {
    const q = search.value.trim().toLowerCase();
    let shown = 0;
    side.querySelectorAll(".side-group").forEach((g) => {
      let n = 0;
      g.querySelectorAll("li").forEach((li) => {
        const ok = !q || li.querySelector(".side-album").dataset.name.includes(q);
        li.hidden = !ok; if (ok) n++;
      });
      g.hidden = n === 0; shown += n;
    });
    if (none) none.hidden = shown > 0;
  });

  // Phone: collapsible panel
  const toggle = side.querySelector(".side-toggle");
  toggle.addEventListener("click", () => {
    const open = side.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  // After picking an album in the panel: close it on phones, bring photos into view
  side.querySelectorAll("[data-filter]").forEach((b) => b.addEventListener("click", () => {
    history.replaceState(null, "", b.dataset.filter === "all" ? location.pathname : "#" + b.dataset.filter);
    if (getComputedStyle(toggle).display !== "none") {
      side.classList.remove("open"); toggle.setAttribute("aria-expanded", "false");
    }
    const top = main.getBoundingClientRect().top;
    if (top < 60 || top > window.innerHeight * 0.6) {
      window.scrollTo({ top: window.scrollY + top - 100, behavior: "smooth" });
    }
  }));

  // Slideshow through the photos currently shown
  const play = document.getElementById("playShow");
  const lightbox = document.getElementById("lightbox");
  if (!play || !lightbox) return;
  let timer = null;
  const badge = document.createElement("span");
  badge.className = "show-badge"; badge.textContent = "▶ Slideshow · press Esc to stop"; badge.hidden = true;
  lightbox.appendChild(badge);
  function stop() {
    clearInterval(timer); timer = null; badge.hidden = true;
    play.textContent = "▶ Play slideshow"; play.closest(".side-play").classList.remove("playing");
  }
  play.addEventListener("click", () => {
    if (timer) return stop();
    const first = [...document.querySelectorAll(".photo-grid .tile")].find((t) => !t.hidden);
    if (!first) return;
    first.click();
    badge.hidden = false;
    play.textContent = "■ Stop slideshow"; play.closest(".side-play").classList.add("playing");
    timer = setInterval(() => {
      if (lightbox.hidden) return stop();
      lightbox.querySelector(".lightbox-next").click();
    }, 3000);
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && timer) { stop(); } });
  new MutationObserver(() => { if (lightbox.hidden && timer) stop(); }).observe(lightbox, { attributes: true, attributeFilter: ["hidden"] });
})();


/* ---------- v3 · Album shelf as an endless auto-scrolling strip ---------- */
(function () {
  const track = document.querySelector(".album-track");
  if (!track) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const originals = [...track.querySelectorAll(".album-card")];
  const strip = document.createElement("div");
  strip.className = "album-marquee";
  originals.forEach((c) => strip.appendChild(c));
  originals.forEach((c) => {
    const k = c.cloneNode(true);
    k.classList.add("clone");
    k.setAttribute("aria-hidden", "true");
    k.tabIndex = -1;
    k.addEventListener("click", () => c.click());
    strip.appendChild(k);
  });
  track.appendChild(strip);
  track.classList.add("is-marquee");
  track.scrollLeft = 0;
  track.addEventListener("scroll", () => { if (track.scrollLeft) track.scrollLeft = 0; });
  if (reduce) track.classList.add("static");

  const clones = () => strip.querySelectorAll(".clone");
  function sync() {
    clones().forEach((k) => {
      const o = originals.find((c) => c.dataset.filter === k.dataset.filter);
      k.classList.toggle("active", !!o && o.classList.contains("active"));
    });
  }
  function speed() {
    const half = strip.scrollWidth / 2;
    strip.style.setProperty("--dur", Math.max(20, half / 45) + "s");
  }
  // keep clone highlights in step with whatever changed the album (shelf, side panel, links)
  document.addEventListener("click", (e) => { if (e.target.closest("[data-filter], .nv-reset")) setTimeout(sync, 0); });
  window.addEventListener("hashchange", () => setTimeout(sync, 0));
  sync();

  // Year tabs: a filtered year shows its albums still and centred; "All albums" resumes the loop
  document.querySelectorAll(".ytab").forEach((tab) => tab.addEventListener("click", () => {
    track.classList.toggle("static", reduce || tab.dataset.year !== "all");
    speed();
  }));
  window.addEventListener("load", speed);
  window.addEventListener("resize", speed);
  speed();
})();


/* ---------- v3 · Gallery right rail: current album card, slideshow, surprise ---------- */
(function () {
  const rail = document.querySelector(".gal-rail");
  const countEl = document.getElementById("galleryCount");
  if (!rail || !countEl) return;
  const cover = document.getElementById("railCover");
  function update() {
    const tiles = [...document.querySelectorAll(".photo-grid .tile")].filter((t) => !t.hidden);
    const name = (document.getElementById("nvName") || {}).textContent || "All Photos";
    document.getElementById("railName").textContent = name;
    document.getElementById("railCount").textContent = tiles.length;
    const all = name === "All Photos";
    const cap = tiles[0] ? tiles[0].dataset.caption || "" : "";
    const year = cap.includes("·") ? cap.split("·").pop().trim() : "Our campus";
    document.getElementById("railMeta").textContent = all ? "Every album · 2 academic years" : `${year} · ${tiles.length} photo${tiles.length === 1 ? "" : "s"}`;
    const img = tiles[all ? 0 : Math.min(1, tiles.length - 1)];
    if (img) {
      const src = img.querySelector("img").getAttribute("src");
      if (cover.getAttribute("src") !== src) {
        cover.classList.remove("swap"); void cover.offsetWidth; cover.classList.add("swap");
        cover.src = src;
      }
    }
  }
  new MutationObserver(update).observe(countEl, { childList: true, characterData: true, subtree: true });
  update();
  const play = document.getElementById("playShow");
  document.getElementById("railPlay").addEventListener("click", () => play && play.click());
  document.getElementById("railRandom").addEventListener("click", () => {
    const opts = [...document.querySelectorAll(".side-album[data-filter]")].filter((b) => b.dataset.filter !== "all" && !b.classList.contains("active"));
    const pick = opts[Math.floor(Math.random() * opts.length)];
    if (pick) pick.click();
  });
})();


/* ---------- v3 · Facilities campus tour ---------- */
(function () {
  const tabs = [...document.querySelectorAll(".tour-tab")];
  if (!tabs.length) return;
  const panels = tabs.map((t) => document.getElementById(t.getAttribute("aria-controls")));
  const dots = [...document.querySelectorAll("#tourDots span")];
  const bar = document.getElementById("tourBar");
  const next = document.getElementById("tourNext");
  const prev = document.getElementById("tourPrev");
  let cur = 0;
  function go(i, focus) {
    i = (i + tabs.length) % tabs.length;
    tabs[cur].classList.add("visited");
    tabs.forEach((t, k) => {
      const on = k === i;
      t.classList.toggle("active", on);
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
      panels[k].hidden = !on;
      if (dots[k]) dots[k].classList.toggle("on", on);
    });
    cur = i;
    if (bar) bar.style.width = ((i + 1) / tabs.length) * 100 + "%";
    next.textContent = i === tabs.length - 1 ? "Back to start ↺" : "Next stop →";
    const list = tabs[i].parentElement;
    if (list.scrollWidth > list.clientWidth) {
      list.scrollTo({ left: tabs[i].offsetLeft - list.clientWidth / 2 + tabs[i].clientWidth / 2, behavior: "smooth" });
    }
    if (focus) tabs[i].focus();
  }
  tabs.forEach((t, i) => {
    t.addEventListener("click", () => go(i));
    t.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown" || e.key === "ArrowRight") { e.preventDefault(); go(cur + 1, true); }
      if (e.key === "ArrowUp" || e.key === "ArrowLeft") { e.preventDefault(); go(cur - 1, true); }
      if (e.key === "Home") { e.preventDefault(); go(0, true); }
      if (e.key === "End") { e.preventDefault(); go(tabs.length - 1, true); }
    });
  });
  next.addEventListener("click", () => go(cur + 1));
  prev.addEventListener("click", () => go(cur - 1));
  // Swipe between stops on phones
  const stage = document.querySelector(".tour-stage");
  let x0 = null;
  stage.addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; }, { passive: true });
  stage.addEventListener("touchend", (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 50) go(cur + (dx < 0 ? 1 : -1));
    x0 = null;
  });
})();



/* ---------- v4 · Facilities sideways showcase (pinned on wide screens) ---------- */
(function () {
  const sec = document.querySelector(".hscroll");
  if (!sec) return;
  const sticky = sec.querySelector(".hs-sticky");
  const track = document.getElementById("hsTrack");
  const panels = [...track.querySelectorAll(".fpanel:not(.fpanel-end)")];
  const nowEl = document.getElementById("hsNow");
  const bar = document.getElementById("hsBar");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let pinned = false, maxShift = 0, range = 1;

  function meter(p) {
    const i = Math.min(panels.length - 1, Math.round(p * (panels.length - 1)));
    nowEl.textContent = String(i + 1).padStart(2, "0");
    bar.style.width = Math.max(8, p * 100) + "%";
  }
  function layout() {
    pinned = window.innerWidth >= 1000 && !reduce;
    sec.classList.toggle("pinned", pinned);
    track.style.transform = "";
    if (pinned) {
      maxShift = Math.max(0, track.scrollWidth - window.innerWidth);
      range = Math.max(1, maxShift);
      sec.style.height = sticky.offsetHeight + range + "px";
    } else {
      sec.style.height = "";
    }
    onScroll();
  }
  function progressPinned() {
    const top = sec.getBoundingClientRect().top - 70;
    return Math.min(1, Math.max(0, -top / range));
  }
  function onScroll() {
    if (pinned) {
      const p = progressPinned();
      track.style.transform = `translate3d(${-p * maxShift}px,0,0)`;
      meter(p);
    } else {
      const m = track.scrollWidth - track.clientWidth;
      meter(m > 0 ? track.scrollLeft / m : 0);
    }
  }
  let ticking = false;
  window.addEventListener("scroll", () => {
    if (ticking) return; ticking = true;
    requestAnimationFrame(() => { ticking = false; if (pinned) onScroll(); });
  }, { passive: true });
  track.addEventListener("scroll", () => { if (!pinned) onScroll(); }, { passive: true });
  window.addEventListener("resize", layout);
  window.addEventListener("load", layout);
  layout();

  // "Learn · Grow · Care" links jump to the right panel in either mode
  document.querySelectorAll('a[href^="#f-"]').forEach((a) => a.addEventListener("click", (e) => {
    const target = document.getElementById(a.getAttribute("href").slice(1));
    if (!target) return;
    e.preventDefault();
    const pad = parseFloat(getComputedStyle(track).paddingLeft) || 0;
    if (pinned) {
      const shift = Math.min(maxShift, Math.max(0, target.offsetLeft - pad - (window.innerWidth - target.offsetWidth) / 2 + pad));
      const secTop = sec.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top: secTop + (shift / maxShift) * range + 2, behavior: "smooth" });
    } else {
      sec.scrollIntoView({ behavior: "smooth" });
      track.scrollTo({ left: target.offsetLeft - (track.clientWidth - target.offsetWidth) / 2, behavior: "smooth" });
    }
  }));
})();


/* ---------- v4 · News & Events: timeline filters, search, month scroll-spy ---------- */
(function () {
  const tl = document.getElementById("timeline");
  if (!tl) return;
  const chips = [...document.querySelectorAll(".ev-chip")];
  const search = document.getElementById("evSearch");
  const status = document.getElementById("evStatus");
  const empty = document.getElementById("evEmpty");
  const months = [...tl.querySelectorAll(".tl-month")];
  const index = [...document.querySelectorAll(".mi")];
  let cat = "all";

  function apply() {
    const q = search.value.trim().toLowerCase();
    let total = 0;
    months.forEach((m) => {
      let n = 0;
      m.querySelectorAll(".tl-ev").forEach((ev) => {
        const ok = (cat === "all" || ev.dataset.cat === cat) && (!q || ev.textContent.toLowerCase().includes(q));
        ev.hidden = !ok; if (ok) n++;
      });
      m.hidden = n === 0;
      m.querySelector(".tl-n").textContent = n;
      const link = index.find((a) => a.dataset.month === m.dataset.month);
      if (link) { link.querySelector("b").textContent = n; link.classList.toggle("empty", n === 0); }
      total += n;
    });
    const label = cat === "all" ? "" : " · " + chips.find((c) => c.dataset.cat === cat).textContent.replace(/\d+\s*$/, "").trim();
    status.textContent = total ? `Showing ${total} event${total === 1 ? "" : "s"}${label}${q ? ` matching “${search.value.trim()}”` : ""}` : "";
    empty.hidden = total > 0;
  }
  chips.forEach((c) => c.addEventListener("click", () => {
    cat = c.dataset.cat;
    chips.forEach((x) => x.classList.toggle("active", x === c));
    apply();
  }));
  search.addEventListener("input", apply);

  // Scroll-spy: highlight the month currently on screen
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const k = e.target.dataset.month;
      index.forEach((a) => {
        const on = a.dataset.month === k;
        a.classList.toggle("on", on);
        if (on && a.parentElement.scrollWidth > a.parentElement.clientWidth) {
          a.parentElement.scrollTo({ left: a.offsetLeft - 16, behavior: "smooth" });
        }
      });
    });
  }, { rootMargin: "-30% 0px -60% 0px" });
  months.forEach((m) => spy.observe(m));
})();


/* ---------- v4 · Contact: open/closed status (IST), today's hours, copy address ---------- */
(function () {
  const status = document.getElementById("ctStatus");
  if (!status) return;
  // Current time in India (IST, UTC+5:30), whatever the visitor's own time zone
  const now = new Date();
  const ist = new Date(now.getTime() + (now.getTimezoneOffset() + 330) * 60000);
  const day = ist.getDay();
  const mins = ist.getHours() * 60 + ist.getMinutes();
  const open = day >= 1 && day <= 6 && mins >= 540 && mins < 1020;
  status.classList.add(open ? "open" : "closed");
  status.innerHTML = open
    ? '<span class="ct-dot"></span><b>Office is open now</b> · until 5:00 PM'
    : '<span class="ct-dot"></span><b>Office is closed now</b> · open Mon – Sat, 9 AM – 5 PM';
  const today = document.querySelector(`#ctWeek li[data-day="${day}"]`);
  if (today) today.classList.add("is-today");
  const tag = document.getElementById("ctToday");
  if (tag) tag.textContent = open ? "Open now" : "Closed now";

  const copy = document.getElementById("ctCopy");
  if (copy) copy.addEventListener("click", async () => {
    const text = "Holy Sai Preparatory School, Thondamuthur Road, Vadavalli, Coimbatore 641041";
    try { await navigator.clipboard.writeText(text); copy.textContent = "✓ Copied"; }
    catch (e) { copy.textContent = "Select & copy above"; }
    setTimeout(() => { copy.textContent = "📋 Copy address"; }, 2200);
  });
})();

/* ---------- v4.4 · Side panels on every page (wide screens): built from the page, hidden over full-width bands ---------- */
(function () {
  const main = document.querySelector("main");
  if (!main) return;
  // Pages that already use the side space themselves
  if (document.querySelector(".gal-layout, .ev-layout, .post-aside")) return;
  const path = (location.pathname.split("/").pop() || "index.html").toLowerCase();

  /* Page-specific side-panel content (all facts taken from the site's own pages) */
  const box = (title, inner, cls = "") => `<div class="sr-box ${cls}">${title ? `<p class="sr-title">${title}</p>` : ""}${inner}</div>`;
  const facts = (rows) => `<ul class="sr-facts">${rows.map(([i, b, s]) => `<li><span>${i}</span><div><b>${b}</b><small>${s}</small></div></li>`).join("")}</ul>`;
  const adm = (h, p) => box("", `<p class="sr-kicker">Admissions 2027–28</p><h3>${h}</h3><p>${p}</p><a href="admissions.html" class="btn btn-gold btn-block btn-sm">Enquire now</a><a href="contact.html" class="sr-link">Book a campus visit →</a>`, "sr-adm");
  const linkList = (rows) => `<nav class="sr-nav">${rows.map(([h, t]) => `<a href="${h}">${t}</a>`).join("")}</nav>`;
  const news = (rows) => rows.map(([d, m, t, s]) => `<a class="sr-news" href="events.html"><span class="date-tile"><b>${d}</b><small>${m}</small></span><span><b>${t}</b><small>${s}</small></span></a>`).join("");
  const stats = (rows) => `<div class="sr-stats">${rows.map(([n, l]) => `<div><b>${n}</b><small>${l}</small></div>`).join("")}</div>`;
  const chips = (arr) => `<div class="sr-chips">${arr.map((c) => `<span>${c}</span>`).join("")}</div>`;
  const person = (img, name, role) => `<div class="sr-person"><img src="assets/images/${img}" alt="" loading="lazy" /><div><b>${name}</b><small>${role}</small></div></div>`;

  const PAGES = {
    "index.html": {
      quote: ["Learn Beyond Limits", "Child-centred education at Holy Sai"],
      right: box("Holy Sai at a glance", stats([["18+", "Years of service"], ["100+", "Expert faculty"], ["10+", "Partnerships"], ["Pre KG – IX", "Classes"]])) +
        adm("Give your child a joyful start", "Pre KG – Grade IX · open from 14 November.") +
        box("Latest from campus", news([["28", "Mar", "Spotlight &amp; KG Graduation", "2026"], ["19", "Jan", "Lit’26 Festival", "Grades VI – IX"]]) + `<a class="sr-link" href="events.html">All news &amp; events →</a>`),
    },
    "about.html": {
      quote: ["Teach the child, not the subject.", "Mrs. R. Chamundeswari, Principal"],
      right: box("Our leadership", person("chairman.png", "Dr. S. Prem Shankar", "Chairman") + person("principal.png", "Mrs. R. Chamundeswari", "Principal")) +
        box("Our journey", `<ol class="sr-time"><li><b>2007</b>Holy Sai International School, Chennai</li><li><b>2013</b>First IGCSE batch</li><li><b>2023</b>Outdoor Learning Centre, Pollachi</li><li><b>2024</b>Holy Sai Preparatory School, Coimbatore</li></ol>`) +
        adm("Become part of the Holy Sai family", "Pre KG – Grade IX · open from 14 November."),
    },
    "academics.html": {
      quote: ["Teach the child, not the subject.", "Mrs. R. Chamundeswari, Principal"],
      right: box("Our four stages", facts([["🧸", "Kindergarten", "Pre KG – Sr KG"], ["✏️", "Primary", "Grades I – V"], ["🔬", "Middle School", "Grades VI – VIII"], ["🎓", "Senior School", "Grade IX"]])) +
        box("9 co-scholastic activities", chips(["Art &amp; Craft", "Dance", "Drums &amp; Keyboard", "Yoga", "Robotics", "Life Skills", "Theatre", "Sports", "Karate"])) +
        adm("Find the right stage for your child", "Open from 14 November."),
    },
    "facilities.html": {
      quote: ["A safe, modern campus", "Thondamuthur Road, Vadavalli"],
      right: box("Campus at a glance", stats([["200", "Auditorium seats"], ["3", "Specialist labs"], ["GPS", "Tracked buses"], ["CCTV", "Across campus"]])) +
        box("Safety first", `<ul class="sr-checks"><li>Qualified medical officer</li><li>Regular health check-ups</li><li>Experienced drivers &amp; attenders</li><li>Visitors by appointment only</li></ul>`) +
        adm("See our campus in person", "Mon – Sat, 9 AM – 5 PM · by appointment."),
    },
    "admissions.html": {
      quote: ["Preparation For Life", "The Holy Sai motto"],
      right: box("Admissions at a glance", facts([["📅", "Academic year 2027–28", "Admissions open"], ["🎓", "Pre KG – Grade IX", "Classes open"], ["🗓️", "From 14 November", "Enquiries begin"]])) +
        box("Need help with your enquiry?", facts([["📞", "+91 99404 30003", "Call the office"], ["🕘", "Mon – Sat, 9 AM – 5 PM", "Office hours"]]) + `<a class="sr-link" href="faq.html">Read the FAQ →</a>`) +
        box("Before you apply", linkList([["academics.html", "📚 Our four stages"], ["facilities.html", "🏫 Facilities &amp; safety"], ["contact.html", "📍 Visit the campus"]])),
    },
    "faq.html": {
      quote: ["Preparation For Life", "The Holy Sai motto"],
      right: box("Still have questions?", facts([["📞", "+91 99404 30003", "Call the office"], ["✉️", "info@holysaiprepschool.org.in", "Email us"], ["🕘", "Mon – Sat, 9 AM – 5 PM", "Office hours"]]), "sr-wrap") +
        box("Popular topics", linkList([["admissions.html", "🎓 Admissions 2027–28"], ["academics.html", "🎨 Co-scholastic activities"], ["facilities.html", "🛡️ Safety &amp; security"], ["contact.html", "📍 Visiting the campus"]])) +
        adm("Ready to take the next step?", "Pre KG – Grade IX · open from 14 November."),
    },
    "blog.html": {
      quote: ["Learn Beyond Limits", "Ideas for parents from Holy Sai"],
      right: box("Popular reads", linkList([
          ["blog/how-emotional-intelligence-shapes-your-childs-academic-success.html", "Emotional intelligence &amp; academic success"],
          ["blog/top-5-benefits-of-extracurricular-activities-for-your-childs-growth.html", "5 benefits of extracurricular activities"],
          ["blog/why-holistic-education-is-key-to-success-a-complete-guide-for-parents.html", "Why holistic education matters"],
          ["blog/how-schools-can-help-children-balance-academics-values-and-well-being.html", "Balancing academics, values &amp; well-being"]]), "sr-reads") +
        box("Follow our moments", linkList([["https://www.instagram.com/holy_sai_prep_school/", "📸 Instagram"], ["https://www.facebook.com/share/1BwLKCTCH5/", "👍 Facebook"], ["https://www.youtube.com/channel/UCna40JH-t01uGz2fLQNgn2g", "▶ YouTube"]])) +
        adm("See these ideas in action", "Pre KG – Grade IX · open from 14 November."),
    },
    "career.html": {
      quote: ["Teach the child, not the subject.", "Mrs. R. Chamundeswari, Principal"],
      right: box("Open roles · 2026–27", facts([["👩‍🏫", "Teaching faculty", "Kindergarten to Grade IX"], ["🏅", "Coaches", "Sports, arts &amp; activities"], ["🗂️", "Administrative staff", "School office"]])) +
        box("Why teach at Holy Sai", `<ul class="sr-checks"><li>Child-centred, unpressurised learning</li><li>300+ teachers trained through Ignite 23</li><li>Part of the Holy Sai Group since 2007</li></ul>`) +
        box("How to apply", facts([["✉️", "Email your CV", "info@holysaiprepschool.org.in"], ["📞", "+91 99404 30003", "Mon – Sat, 9 AM – 5 PM"]]), "sr-wrap"),
    },
    "contact.html": {
      quote: ["We’re here to help", "Holy Sai Preparatory School office"],
      right: box("Before you visit", `<ul class="sr-checks"><li>Visits are by prior appointment</li><li>Office open Mon – Sat, 9 AM – 5 PM</li><li>Ask about admissions for 2027–28</li></ul>`) +
        box("Plan ahead", linkList([["admissions.html", "🎓 Admission enquiry"], ["facilities.html", "🏫 Explore our facilities"], ["faq.html", "❓ Read the FAQ"]])) +
        box("Find us", facts([["📍", "Thondamuthur Road", "Vadavalli, Coimbatore 641041"]]) + `<a class="sr-link" href="https://www.google.com/maps/dir/?api=1&amp;destination=Holy+Sai+Preparatory+School,+Thondamuthur+Road,+Vadavalli,+Coimbatore+641041" target="_blank" rel="noopener">Get directions ↗</a>`),
    },
  };
  const PAGE = PAGES[path] || PAGES["index.html"];

  let rails = document.querySelector(".side-rails");
  if (!rails) {
    const clean = (s) => s.replace(/[“”"]/g, "").replace(/\s+/g, " ").trim();
    const nice = (s) => { s = clean(s); return s.length > 34 ? s.slice(0, 32).replace(/\s+\S*$/, "") + "…" : s; };
    const sections = [...main.querySelectorAll(":scope > section")].slice(1).filter((s) => !s.classList.contains("cta"));
    const toc = [];
    sections.forEach((s, i) => {
      const h = s.querySelector("h2");
      if (!h) return;
      const tag = s.querySelector(".eyebrow, .pill, .kicker");
      let label = tag && clean(tag.textContent).length < 30 ? clean(tag.textContent) : nice(h.textContent);
      label = label.replace(/^[^\p{L}\d]+/u, "");
      label = label.charAt(0).toUpperCase() + label.slice(1);
      if (!s.id) s.id = "sec-" + (i + 1);
      toc.push(`<a href="#${s.id}" data-spy="${s.id}">${label}</a>`);
    });
    const EXPLORE = [["admissions.html", "🎓 Admissions"], ["academics.html", "📚 Academics"], ["facilities.html", "🏫 Facilities"],
      ["events.html", "📰 News & Events"], ["gallery.html", "📷 Gallery"], ["contact.html", "📍 Contact us"]]
      .filter(([h]) => h !== path).slice(0, 5)
      .map(([h, t]) => `<a href="${h}">${t}</a>`).join("");
    const left = toc.length >= 3
      ? `<div class="sr-box"><p class="sr-title">On this page</p><div class="sr-progress"><span id="srBar"></span></div><nav class="sr-nav">${toc.join("")}</nav></div>`
      : `<div class="sr-box"><p class="sr-title">Explore Holy Sai</p><nav class="sr-nav">${EXPLORE}</nav></div>`;
    rails = document.createElement("div");
    rails.className = "side-rails";
    rails.innerHTML = `
      <aside class="srail srail-left" aria-label="Page guide">${left}
        <div class="sr-box sr-quote"><p>“${PAGE.quote[0]}”</p><small>${PAGE.quote[1]}</small></div>
      </aside>
      <aside class="srail srail-right" aria-label="About this page">${PAGE.right}</aside>`;
    main.appendChild(rails);
  }

  else {
    const r = rails.querySelector(".srail-right"); if (r) r.innerHTML = PAGE.right;
    const q = rails.querySelector(".sr-quote"); if (q) q.innerHTML = `<p>“${PAGE.quote[0]}”</p><small>${PAGE.quote[1]}</small>`;
  }
  const start = main.querySelector(":scope > section");
  const end = main.querySelector(".cta") || document.querySelector(".footer");
  const links = [...rails.querySelectorAll("[data-spy]")];
  const targets = links.map((a) => document.getElementById(a.dataset.spy)).filter(Boolean);
  const bar = rails.querySelector("#srBar");
  const wide = [...document.querySelectorAll(".hscroll, .ct-find, .ct-social, .parallax-band, .marquee, .safety-band, .stats, .ac-glance, .footer, .container-wide, .hs-track, .fx-hero, .page-hero, .hero, .ac-hero, .ct-hero, .cta")];
  const left = rails.querySelector(".srail-left");

  function update() {
    const vh = window.innerHeight;
    // Fit the panels into the free gap between any full-width bands on screen, above the chat button
    let topLim = 100, botLim = vh - 170;
    wide.forEach((w) => {
      const r = w.getBoundingClientRect();
      if (r.bottom <= topLim || r.top >= botLim) return;
      if ((r.top + r.bottom) / 2 < vh / 2) topLim = Math.max(topLim, r.bottom + 18);
      else botLim = Math.min(botLim, r.top - 18);
    });
    const room = botLim - topLim;
    const ok = room >= 260 && start.getBoundingClientRect().bottom < vh * 0.85;
    rails.style.setProperty("--rt", topLim + "px");
    rails.style.setProperty("--rh", Math.max(0, room) + "px");
    rails.classList.toggle("show", ok);
    // Never crop a card: show whole cards in order until the free space runs out
    rails.querySelectorAll(".srail").forEach((rail) => {
      const boxes = [...rail.children];
      boxes.forEach((b) => { b.style.display = ""; });
      let used = 0;
      boxes.forEach((b, k) => {
        const h = b.offsetHeight + (k ? 16 : 0);
        if (used + h > room) b.style.display = "none"; else used += h;
      });
    });
    let cur = null;
    targets.forEach((t) => { if (t.getBoundingClientRect().top < vh * 0.4) cur = t.id; });
    links.forEach((a) => a.classList.toggle("on", a.dataset.spy === cur));
    if (bar) {
      const a = start.getBoundingClientRect().bottom + window.scrollY;
      const b = end.getBoundingClientRect().top + window.scrollY - vh;
      bar.style.width = Math.min(100, Math.max(0, ((window.scrollY - a + vh) / (b - a + vh)) * 100)) + "%";
    }
  }
  let t = false;
  window.addEventListener("scroll", () => { if (!t) { t = true; requestAnimationFrame(() => { t = false; update(); }); } }, { passive: true });
  window.addEventListener("resize", update);
  update();
})();
