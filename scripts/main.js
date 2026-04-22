(function () {
  "use strict";

  var data = window.PORTFOLIO_DATA;

  if (!data) {
    return;
  }

  var state = {
    artifactIndex: 0,
    galleryIndex: 0,
    philosophyIndex: 0,
    sectionRatios: new Map(),
    revealObserver: null,
    sectionObserver: null
  };

  var toneMap = {
    amber: "rgba(205, 170, 99, 0.28)",
    cobalt: "rgba(81, 110, 148, 0.28)",
    sage: "rgba(118, 154, 135, 0.26)",
    rose: "rgba(181, 126, 151, 0.24)"
  };

  var impactScores = [88, 74, 91];

  var mediaQueries = {
    mobile: window.matchMedia("(max-width: 960px)"),
    reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)")
  };

  var refs = {
    introScreen: document.getElementById("introScreen"),
    introPercent: document.getElementById("introPercent"),
    introMeterFill: document.getElementById("introMeterFill"),
    desktopNav: document.getElementById("desktopNav"),
    mobileNav: document.getElementById("mobileNav"),
    navProgress: document.getElementById("navProgress"),
    brandMini: document.getElementById("brandMini"),
    brandLine1: document.getElementById("brandLine1"),
    mobileBrandLine1: document.getElementById("mobileBrandLine1"),
    mobileBrand: document.getElementById("mobileBrand"),
    yearStamp: document.getElementById("yearStamp"),
    menuToggle: document.getElementById("menuToggle"),
    mobileDrawer: document.getElementById("mobileDrawer"),
    experience: document.getElementById("experience"),
    hero: document.getElementById("hero"),
    journey: document.getElementById("journey"),
    profile: document.getElementById("profile"),
    artifacts: document.getElementById("artifacts"),
    actions: document.getElementById("actions"),
    reflection: document.getElementById("reflection"),
    contact: document.getElementById("contact")
  };

  var INTRO_LOADING_MS = 4000;
  var INTRO_HOLD_MS = 520;
  var INTRO_UNSEAL_MS = 700;
  var INTRO_EXIT_MS = 2600;

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function socialIconMarkup(name) {
    if (name === "youtube") {
      return (
        '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
        '<rect x="3" y="6.5" width="18" height="11" rx="3.5" ry="3.5"></rect>' +
        '<path d="M10 9.5 15.5 12 10 14.5Z"></path>' +
        "</svg>"
      );
    }

    if (name === "linkedin") {
      return (
        '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
        '<rect x="3.5" y="3.5" width="17" height="17" rx="4.5" ry="4.5"></rect>' +
        '<path d="M8.1 10.2v6.1"></path>' +
        '<path d="M8.1 7.7h.1"></path>' +
        '<path d="M12 16.3v-3.4c0-1.3.6-2.2 1.8-2.2 1 0 1.5.7 1.5 2v3.6"></path>' +
        "</svg>"
      );
    }

    if (name === "email") {
      return (
        '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
        '<rect x="3.5" y="6" width="17" height="12" rx="3.2" ry="3.2"></rect>' +
        '<path d="m5.2 8.1 6.8 5 6.8-5"></path>' +
        "</svg>"
      );
    }

    return (
      '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
      '<rect x="4.5" y="4.5" width="15" height="15" rx="4.5" ry="4.5"></rect>' +
      '<circle cx="12" cy="12" r="3.6"></circle>' +
      '<circle cx="16.9" cy="7.2" r="1"></circle>' +
      "</svg>"
    );
  }

  function sectionHeading(eyebrow, title, intro) {
    return (
      '<div class="section-heading">' +
      '<p class="eyebrow" data-reveal="top">' + escapeHtml(eyebrow) + "</p>" +
      '<h2 data-reveal="top">' + escapeHtml(title) + "</h2>" +
      '<p data-reveal="top">' + escapeHtml(intro) + "</p>" +
      "</div>"
    );
  }

  function buildNavMarkup() {
    return data.site.nav
      .map(function (item) {
        return (
          '<a class="nav-link" href="#' +
          escapeHtml(item.id) +
          '" data-target="' +
          escapeHtml(item.id) +
          '">' +
          escapeHtml(item.label) +
          "</a>"
        );
      })
      .join("");
  }

  function renderHero() {
    var site = data.site;
    var portrait = site.heroPortrait || {};
    var titleMarkup = Array.isArray(site.heroTitleLines)
      ? site.heroTitleLines
          .map(function (line) {
            return '<span class="hero__title-line">' + escapeHtml(line) + "</span>";
          })
          .join("")
      : escapeHtml(site.heroTitle);
    var actions = site.ctas
      .map(function (item) {
        return (
          '<a class="button button--' +
          escapeHtml(item.variant) +
          ' hero__icon-button hero__icon-button--' +
          escapeHtml(item.icon || "generic") +
          '" href="' +
          escapeHtml(item.target) +
          '" aria-label="' +
          escapeHtml(item.label) +
          '" title="' +
          escapeHtml(item.label) +
          '">' +
          socialIconMarkup(item.icon || "generic") +
          '<span class="sr-only">' +
          escapeHtml(item.label) +
          "</span>" +
          "</a>"
        );
      })
      .join("");

    refs.hero.innerHTML =
      '<div class="hero">' +
      '<div class="hero__backdrop" aria-hidden="true">' +
      '<span class="hero__mist hero__mist--one"></span>' +
      '<span class="hero__mist hero__mist--two"></span>' +
      '<span class="hero__veil hero__veil--one"></span>' +
      '<span class="hero__veil hero__veil--two"></span>' +
      '<span class="hero__arc hero__arc--one"></span>' +
      '<span class="hero__arc hero__arc--two"></span>' +
      '<span class="hero__dot hero__dot--one"></span>' +
      '<span class="hero__dot hero__dot--two"></span>' +
      '<span class="hero__cross hero__cross--one"></span>' +
      '<span class="hero__cross hero__cross--two"></span>' +
      '<span class="hero__spark hero__spark--one"></span>' +
      '<span class="hero__spark hero__spark--two"></span>' +
      "</div>" +
      '<div class="section-shell hero__grid">' +
      '<div class="hero__content">' +
      '<p class="eyebrow" data-reveal="top">' + escapeHtml(site.heroEyebrow) + "</p>" +
      '<h1 class="hero__title" data-reveal="top">' + titleMarkup + "</h1>" +
      '<p class="hero__lead" data-reveal="top">' + escapeHtml(site.heroLead) + "</p>" +
      '<p class="hero__description" data-reveal="top">' + escapeHtml(site.heroDescription) + "</p>" +
      '<div class="hero__divider" data-reveal="top"><span></span><span></span><span></span></div>' +
      '<div class="hero__actions" data-reveal="top">' + actions + "</div>" +
      "</div>" +
      '<div class="hero__portrait-wrap" data-reveal="right">' +
      '<div class="hero__portrait-stage">' +
      '<span class="hero__portrait-ornament hero__portrait-ornament--one" aria-hidden="true"></span>' +
      '<span class="hero__portrait-ornament hero__portrait-ornament--two" aria-hidden="true"></span>' +
      '<span class="hero__portrait-ornament hero__portrait-ornament--three" aria-hidden="true"></span>' +
      '<span class="hero__portrait-glow" aria-hidden="true"></span>' +
      '<span class="hero__portrait-shadow" aria-hidden="true"></span>' +
      '<img class="hero__portrait-image" src="' +
      escapeHtml(portrait.image || "assets/kenzo-teacher.png") +
      '" alt="' +
      escapeHtml(portrait.alt || "Foto profil Kenzo Elvano") +
      '">' +
      "</div>" +
      "</div>" +
      "</div>" +
      "</div>";
  }

  function renderJourney() {
    var timeline = data.timeline;
    var events = timeline.events
      .map(function (event) {
        return (
          '<article class="journey-card" data-reveal="right">' +
          '<span class="journey-card__index">' + escapeHtml(event.period) + "</span>" +
          '<div class="journey-card__body">' +
          '<span class="status-chip">' + escapeHtml(event.status) + "</span>" +
          "<h3>" + escapeHtml(event.title) + "</h3>" +
          "<p>" + escapeHtml(event.description) + "</p>" +
          '<div class="journey-card__focus"><strong>Fokus</strong><span>' + escapeHtml(event.focus) + "</span></div>" +
          "</div>" +
          "</article>"
        );
      })
      .join("");

    refs.journey.innerHTML =
      '<div class="section-shell">' +
      sectionHeading(timeline.eyebrow, timeline.title, timeline.intro) +
      '<div class="journey">' +
      '<aside class="journey__intro card-panel" data-reveal="left">' +
      "<p>" + escapeHtml(data.site.footerNote) + "</p>" +
      "</aside>" +
      '<div class="journey__timeline">' + events + "</div>" +
      "</div>" +
      "</div>";
  }

  function renderProfile() {
    var profile = data.profile;
    var philosophy = data.philosophy;

    var facts = profile.identity
      .map(function (item) {
        return (
          "<div>" +
          "<dt>" + escapeHtml(item.label) + "</dt>" +
          "<dd>" + escapeHtml(item.value) + "</dd>" +
          "</div>"
        );
      })
      .join("");

    var strengths = profile.strengths
      .map(function (item) {
        return "<li>" + escapeHtml(item) + "</li>";
      })
      .join("");

    var tabs = philosophy.scenes
      .map(function (scene, index) {
        return (
          '<button class="philosophy-tab" type="button" role="tab" aria-selected="' +
          String(index === 0) +
          '" data-scene-index="' +
          String(index) +
          '">' +
          escapeHtml(scene.label) +
          "</button>"
        );
      })
      .join("");

    refs.profile.innerHTML =
      '<div class="section-shell">' +
      sectionHeading(profile.eyebrow, profile.title, philosophy.lead) +
      '<div class="profile-layout">' +
      '<article class="profile-card" data-reveal="left">' +
      '<div class="profile-card__head">' +
      '<img class="profile-card__mark" src="assets/logo-ppg.png" alt="Logo PPG">' +
      "<div>" +
      '<p class="profile-card__role">' + escapeHtml(profile.role) + "</p>" +
      "<h3>" + escapeHtml(profile.name) + "</h3>" +
      "</div>" +
      "</div>" +
      '<p class="profile-card__greeting">' + escapeHtml(profile.greeting) + "</p>" +
      '<p class="profile-card__intro">' + escapeHtml(profile.intro) + "</p>" +
      "<blockquote>" + escapeHtml(profile.quote) + "</blockquote>" +
      '<dl class="profile-card__facts">' + facts + "</dl>" +
      '<ul class="profile-card__strengths">' + strengths + "</ul>" +
      "</article>" +
      '<section class="philosophy-card" data-reveal="right">' +
      '<div class="philosophy-card__header">' +
      "<p>" + escapeHtml(philosophy.lead) + "</p>" +
      "</div>" +
      '<div class="philosophy-switch" id="philosophyTabs" role="tablist" aria-label="Lensa filosofi pendidikan">' +
      tabs +
      "</div>" +
      '<div class="philosophy-stage" id="philosophyStage"></div>' +
      "</section>" +
      "</div>" +
      "</div>";
  }

  function renderArtifacts() {
    var artifacts = data.artifacts;
    var rail = artifacts.items
      .map(function (item, index) {
        return (
          '<button class="artifact-card' +
          (index === 0 ? " is-active" : "") +
          '" type="button" data-artifact-index="' +
          String(index) +
          '" aria-pressed="' +
          String(index === 0) +
          '">' +
          '<div class="artifact-card__image">' +
          '<img src="' + escapeHtml(item.image) + '" alt="' + escapeHtml(item.title) + '">' +
          "</div>" +
          '<div class="artifact-card__body">' +
          '<span class="artifact-card__tag">' + escapeHtml(item.tag) + "</span>" +
          '<strong class="artifact-card__title">' + escapeHtml(item.title) + "</strong>" +
          '<span class="artifact-card__status">' + escapeHtml(item.status) + "</span>" +
          "</div>" +
          "</button>"
        );
      })
      .join("");

    refs.artifacts.innerHTML =
      '<div class="section-shell">' +
      sectionHeading(artifacts.eyebrow, artifacts.title, artifacts.intro) +
      '<div class="artifact-stage">' +
      '<article class="artifact-stage__feature" data-reveal="left">' +
      '<div class="artifact-stage__image-wrap">' +
      '<img id="artifactStageImage" src="" alt="Pratinjau karya">' +
      '<span class="artifact-stage__badge" id="artifactStageTag"></span>' +
      "</div>" +
      '<div class="artifact-stage__copy">' +
      '<div class="artifact-stage__status"><span class="status-chip" id="artifactStageStatus"></span></div>' +
      '<h3 id="artifactStageTitle"></h3>' +
      '<p id="artifactStageSummary"></p>' +
      '<ul class="artifact-stage__bullets" id="artifactStageBullets"></ul>' +
      '<a class="artifact-stage__link" id="artifactStageLink" href="#contact">Siapkan lampiran akhir</a>' +
      "</div>" +
      "</article>" +
      '<div class="artifact-rail-wrap" data-reveal="top">' +
      '<div class="artifact-rail__head">' +
      "<div>" +
      '<p class="eyebrow eyebrow--small">Navigasi Karya</p>' +
      "<h3>Pilih sorotan karya untuk membuka detail panggung utama.</h3>" +
      "</div>" +
      '<div class="artifact-controls">' +
      '<button class="artifact-control" id="artifactPrev" type="button" aria-label="Karya sebelumnya">&#8592;</button>' +
      '<button class="artifact-control" id="artifactNext" type="button" aria-label="Karya berikutnya">&#8594;</button>' +
      "</div>" +
      "</div>" +
      '<div class="artifact-rail" id="artifactRail">' + rail + "</div>" +
      "</div>" +
      "</div>" +
      "</div>";
  }

  function renderActions() {
    var actions = data.actions;
    var gallery = data.gallery;

    var actionCards = actions.items
      .map(function (item) {
        return (
          '<article class="action-card" data-reveal="left">' +
          '<div class="action-card__meta">' +
          '<span class="action-card__tag">' + escapeHtml(item.tag) + "</span>" +
          '<span class="action-card__status">' + escapeHtml(item.status) + "</span>" +
          "</div>" +
          "<h3>" + escapeHtml(item.title) + "</h3>" +
          "<p>" + escapeHtml(item.summary) + "</p>" +
          "</article>"
        );
      })
      .join("");

    var thumbs = gallery.items
      .map(function (item, index) {
        return (
          '<button class="gallery-thumb' +
          (index === 0 ? " is-active" : "") +
          '" type="button" data-gallery-index="' +
          String(index) +
          '" aria-pressed="' +
          String(index === 0) +
          '">' +
          '<img src="' + escapeHtml(item.image) + '" alt="' + escapeHtml(item.title) + '">' +
          '<span class="gallery-thumb__copy">' +
          "<strong>" + escapeHtml(item.title) + "</strong>" +
          "<span>" + escapeHtml(item.tag) + "</span>" +
          "</span>" +
          "</button>"
        );
      })
      .join("");

    refs.actions.innerHTML =
      '<div class="section-shell">' +
      sectionHeading(actions.eyebrow, actions.title, actions.intro) +
      '<div class="actions-layout">' +
      '<div class="action-highlights">' + actionCards + "</div>" +
      '<div class="gallery-stage" data-reveal="right">' +
      '<article class="gallery-preview">' +
      '<div class="gallery-preview__image">' +
      '<img id="galleryPreviewImage" src="" alt="Dokumentasi praktik">' +
      '<div class="gallery-preview__overlay">' +
      '<span class="gallery-preview__tag" id="galleryPreviewTag"></span>' +
      '<h3 id="galleryPreviewTitle"></h3>' +
      "</div>" +
      "</div>" +
      '<div class="gallery-preview__body">' +
      '<p id="galleryPreviewSummary"></p>' +
      '<a class="button button--ghost" id="galleryPreviewLink" href="#contact">Siapkan dokumentasi final</a>' +
      "</div>" +
      "</article>" +
      '<div class="gallery-strip" id="galleryStrip">' + thumbs + "</div>" +
      "</div>" +
      "</div>" +
      "</div>";
  }

  function renderReflection() {
    var reflection = data.reflection;
    var cards = reflection.cards
      .map(function (card) {
        return (
          '<article class="reflection-card" data-reveal="bottom">' +
          '<span class="reflection-card__metric">' + escapeHtml(card.metric) + "</span>" +
          "<h3>" + escapeHtml(card.title) + "</h3>" +
          "<p>" + escapeHtml(card.text) + "</p>" +
          '<span class="reflection-card__label">' + escapeHtml(card.label) + "</span>" +
          "</article>"
        );
      })
      .join("");

    var commitments = reflection.commitments
      .map(function (item) {
        return "<li>" + escapeHtml(item) + "</li>";
      })
      .join("");

    var meters = reflection.cards
      .map(function (card, index) {
        return (
          '<div class="impact-meter__item">' +
          '<div class="impact-meter__head"><span>' +
          escapeHtml(card.metric) +
          "</span><span>" +
          String(impactScores[index] || 80) +
          "%</span></div>" +
          '<div class="impact-meter__track"><span class="impact-meter__bar" style="--bar-width:' +
          String(impactScores[index] || 80) +
          '%;"></span></div>' +
          "</div>"
        );
      })
      .join("");

    refs.reflection.innerHTML =
      '<div class="section-shell">' +
      sectionHeading(reflection.eyebrow, reflection.title, reflection.intro) +
      '<div class="reflection-layout">' +
      '<div class="reflection-grid">' + cards + "</div>" +
      '<aside class="reflection-commitments" data-reveal="right">' +
      "<h3>Komitmen penguatan berikutnya</h3>" +
      "<ul>" + commitments + "</ul>" +
      '<div class="impact-meter">' + meters + "</div>" +
      "</aside>" +
      "</div>" +
      "</div>";
  }

  function renderContact() {
    var contact = data.contact;
    var items = contact.items
      .map(function (item) {
        return (
          '<a class="contact-link" href="' +
          escapeHtml(item.link) +
          '">' +
          '<span class="contact-link__label">' + escapeHtml(item.label) + "</span>" +
          "<strong>" + escapeHtml(item.value) + "</strong>" +
          "</a>"
        );
      })
      .join("");

    refs.contact.innerHTML =
      '<div class="section-shell">' +
      '<div class="contact-hero">' +
      '<div class="contact-hero__copy">' +
      '<p class="eyebrow" data-reveal="top">' + escapeHtml(contact.eyebrow) + "</p>" +
      '<h2 data-reveal="top">' + escapeHtml(contact.title) + "</h2>" +
      '<p data-reveal="top">' + escapeHtml(contact.message) + "</p>" +
      '<div class="hero__actions" data-reveal="top">' +
      '<a class="button button--solid" href="#hero">Kembali ke cover</a>' +
      '<a class="button button--ghost" href="#artifacts">Lihat karya utama</a>' +
      "</div>" +
      "</div>" +
      '<aside class="contact-panel" data-reveal="left">' +
      "<h3>Ruang personalisasi cepat</h3>" +
      '<div class="contact-panel__list">' + items + "</div>" +
      '<p class="contact-panel__note">' + escapeHtml(contact.note) + "</p>" +
      "</aside>" +
      "</div>" +
      '<footer class="page-footer" data-reveal="bottom">' +
      "<p>" + escapeHtml(data.site.ownerName) + " · " + escapeHtml(data.site.cohort) + "</p>" +
      "<p>" + escapeHtml(data.site.footerNote) + "</p>" +
      "</footer>" +
      "</div>";
  }

  function renderAllSections() {
    refs.brandLine1.textContent = "";
    refs.brandMini.textContent = data.site.shortTitle;
    refs.mobileBrandLine1.textContent = "";
    refs.mobileBrand.textContent = data.site.shortTitle;
    refs.yearStamp.textContent = "PPG 2026";
    refs.desktopNav.innerHTML = buildNavMarkup();
    refs.mobileNav.innerHTML = buildNavMarkup();
    renderHero();
    renderJourney();
    renderProfile();
    renderArtifacts();
    renderActions();
    renderReflection();
    renderContact();
  }

  function updatePhilosophyScene(index) {
    var scenes = data.philosophy.scenes;
    state.philosophyIndex = (index + scenes.length) % scenes.length;
    var current = scenes[state.philosophyIndex];
    var stage = document.getElementById("philosophyStage");
    var tabs = document.querySelectorAll(".philosophy-tab");

    if (!stage) {
      return;
    }

    stage.style.setProperty("--scene-accent", toneMap[current.tone] || toneMap.amber);
    stage.innerHTML =
      '<div class="philosophy-stage__content">' +
      '<span class="philosophy-stage__kicker">' + escapeHtml(current.kicker) + "</span>" +
      '<h3 class="philosophy-stage__title">' + escapeHtml(current.title) + "</h3>" +
      '<p class="philosophy-stage__text">' + escapeHtml(current.text) + "</p>" +
      '<ul class="philosophy-stage__points">' +
      current.points
        .map(function (item) {
          return "<li>" + escapeHtml(item) + "</li>";
        })
        .join("") +
      "</ul>" +
      "</div>";

    tabs.forEach(function (tab, tabIndex) {
      var isActive = tabIndex === state.philosophyIndex;
      tab.setAttribute("aria-selected", String(isActive));
    });
  }

  function updateArtifact(index) {
    var items = data.artifacts.items;
    state.artifactIndex = (index + items.length) % items.length;
    var current = items[state.artifactIndex];
    var cards = document.querySelectorAll(".artifact-card");
    var image = document.getElementById("artifactStageImage");
    var tag = document.getElementById("artifactStageTag");
    var status = document.getElementById("artifactStageStatus");
    var title = document.getElementById("artifactStageTitle");
    var summary = document.getElementById("artifactStageSummary");
    var bullets = document.getElementById("artifactStageBullets");
    var link = document.getElementById("artifactStageLink");

    if (!image) {
      return;
    }

    image.src = current.image;
    image.alt = current.title;
    tag.textContent = current.tag;
    status.textContent = current.status;
    title.textContent = current.title;
    summary.textContent = current.summary;
    bullets.innerHTML = (current.bullets || [])
      .map(function (item) {
        return "<li>" + escapeHtml(item) + "</li>";
      })
      .join("");
    link.setAttribute("href", current.link || "#contact");

    cards.forEach(function (card, cardIndex) {
      var isActive = cardIndex === state.artifactIndex;
      card.classList.toggle("is-active", isActive);
      card.setAttribute("aria-pressed", String(isActive));
    });
  }

  function updateGallery(index) {
    var items = data.gallery.items;
    state.galleryIndex = (index + items.length) % items.length;
    var current = items[state.galleryIndex];
    var thumbs = document.querySelectorAll(".gallery-thumb");
    var image = document.getElementById("galleryPreviewImage");
    var tag = document.getElementById("galleryPreviewTag");
    var title = document.getElementById("galleryPreviewTitle");
    var summary = document.getElementById("galleryPreviewSummary");
    var link = document.getElementById("galleryPreviewLink");

    if (!image) {
      return;
    }

    image.src = current.image;
    image.alt = current.title;
    tag.textContent = current.tag;
    title.textContent = current.title;
    summary.textContent = current.summary;
    link.setAttribute("href", current.link || "#contact");

    thumbs.forEach(function (thumb, thumbIndex) {
      var isActive = thumbIndex === state.galleryIndex;
      thumb.classList.toggle("is-active", isActive);
      thumb.setAttribute("aria-pressed", String(isActive));
    });
  }

  function closeMobileDrawer() {
    refs.mobileDrawer.hidden = true;
    refs.menuToggle.setAttribute("aria-expanded", "false");
  }

  function bindNavigation() {
    document.querySelectorAll(".nav-link").forEach(function (link) {
      link.addEventListener("click", function (event) {
        var targetId = link.getAttribute("data-target");
        var target = document.getElementById(targetId);

        if (!target) {
          return;
        }

        event.preventDefault();
        closeMobileDrawer();
        target.scrollIntoView({
          behavior: mediaQueries.reducedMotion.matches ? "auto" : "smooth",
          block: "start"
        });
      });
    });

    refs.menuToggle.addEventListener("click", function () {
      var expanded = refs.menuToggle.getAttribute("aria-expanded") === "true";
      refs.menuToggle.setAttribute("aria-expanded", String(!expanded));
      refs.mobileDrawer.hidden = expanded;
    });
  }

  function bindPhilosophy() {
    document.querySelectorAll(".philosophy-tab").forEach(function (tab) {
      tab.addEventListener("click", function () {
        updatePhilosophyScene(Number(tab.getAttribute("data-scene-index")));
      });
    });

    updatePhilosophyScene(0);
  }

  function bindArtifacts() {
    document.querySelectorAll(".artifact-card").forEach(function (card) {
      card.addEventListener("click", function () {
        updateArtifact(Number(card.getAttribute("data-artifact-index")));
      });
    });

    document.getElementById("artifactPrev").addEventListener("click", function () {
      updateArtifact(state.artifactIndex - 1);
    });

    document.getElementById("artifactNext").addEventListener("click", function () {
      updateArtifact(state.artifactIndex + 1);
    });

    updateArtifact(0);
  }

  function bindGallery() {
    document.querySelectorAll(".gallery-thumb").forEach(function (thumb) {
      thumb.addEventListener("click", function () {
        updateGallery(Number(thumb.getAttribute("data-gallery-index")));
      });
    });

    updateGallery(0);
  }

  function setupRevealObserver() {
    if (state.revealObserver) {
      state.revealObserver.disconnect();
    }

    state.revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            state.revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        root: mediaQueries.mobile.matches ? null : refs.experience,
        rootMargin: "0px 0px -10% 0px",
        threshold: 0.16
      }
    );

    document.querySelectorAll("[data-reveal]").forEach(function (node) {
      state.revealObserver.observe(node);
    });

    document.querySelectorAll("#hero [data-reveal]").forEach(function (node) {
      node.classList.add("is-visible");
    });
  }

  function updateActiveSection(sectionId) {
    var index = data.site.nav.findIndex(function (item) {
      return item.id === sectionId;
    });
    var progress = index <= 0 ? 14 : ((index + 1) / data.site.nav.length) * 100;

    document.querySelectorAll(".nav-link").forEach(function (link) {
      link.classList.toggle("is-active", link.getAttribute("data-target") === sectionId);
    });

    refs.navProgress.style.height = Math.max(progress, 14) + "%";
  }

  function applyBestVisibleSection() {
    var bestId = data.site.nav[0].id;
    var bestRatio = -1;

    data.site.nav.forEach(function (item) {
      var ratio = state.sectionRatios.get(item.id) || 0;
      if (ratio > bestRatio) {
        bestRatio = ratio;
        bestId = item.id;
      }
    });

    updateActiveSection(bestId);
  }

  function setupSectionObserver() {
    if (state.sectionObserver) {
      state.sectionObserver.disconnect();
    }

    state.sectionRatios.clear();

    state.sectionObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          state.sectionRatios.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
        });
        applyBestVisibleSection();
      },
      {
        root: mediaQueries.mobile.matches ? null : refs.experience,
        rootMargin: mediaQueries.mobile.matches ? "-30% 0px -40% 0px" : "-20% 0px -24% 0px",
        threshold: [0.15, 0.32, 0.5, 0.72]
      }
    );

    data.site.nav.forEach(function (item) {
      var section = document.getElementById(item.id);
      if (section) {
        state.sectionRatios.set(item.id, 0);
        state.sectionObserver.observe(section);
      }
    });

    updateActiveSection(data.site.nav[0].id);
  }

  function setupParallax() {
    if (mediaQueries.reducedMotion.matches) {
      return;
    }

    refs.hero.addEventListener("pointermove", function (event) {
      if (mediaQueries.mobile.matches) {
        return;
      }

      var bounds = refs.hero.getBoundingClientRect();
      var x = (event.clientX - bounds.left) / bounds.width;
      var y = (event.clientY - bounds.top) / bounds.height;

      refs.hero.style.setProperty("--pointer-x", String(Math.max(0, Math.min(1, x))));
      refs.hero.style.setProperty("--pointer-y", String(Math.max(0, Math.min(1, y))));
    });

    refs.hero.addEventListener("pointerleave", function () {
      refs.hero.style.setProperty("--pointer-x", "0.5");
      refs.hero.style.setProperty("--pointer-y", "0.5");
    });
  }

  function handleMediaChange() {
    closeMobileDrawer();
    setupRevealObserver();
    setupSectionObserver();
  }

  function bindMediaChange(query, handler) {
    if (typeof query.addEventListener === "function") {
      query.addEventListener("change", handler);
    } else if (typeof query.addListener === "function") {
      query.addListener(handler);
    }
  }

  function completeIntro() {
    document.body.classList.remove(
      "is-intro-active",
      "is-intro-ready",
      "is-intro-unsealing",
      "is-intro-ending"
    );
    document.body.classList.add("is-intro-complete");

    if (refs.introScreen) {
      refs.introScreen.setAttribute("hidden", "");
    }
  }

  function setIntroProgress(percent) {
    if (refs.introPercent) {
      refs.introPercent.textContent = String(percent) + "%";
    }

    if (refs.introMeterFill) {
      refs.introMeterFill.style.width = String(percent) + "%";
    }
  }

  function playIntro() {
    if (!refs.introScreen) {
      document.body.classList.add("is-intro-complete");
      return;
    }

    document.body.classList.remove("is-intro-complete", "is-intro-ready", "is-intro-unsealing", "is-intro-ending");
    document.body.classList.add("is-intro-active");
    setIntroProgress(1);

    var introStartedAt = 0;
    var hasExited = false;
    var hasReachedLoad = false;

    function beginExit() {
      if (hasExited) {
        return;
      }

      hasExited = true;
      document.body.classList.add("is-intro-ending");
      window.setTimeout(completeIntro, INTRO_EXIT_MS);
    }

    function beginUnseal() {
      if (hasReachedLoad) {
        return;
      }

      hasReachedLoad = true;
      setIntroProgress(100);
      document.body.classList.add("is-intro-ready");

      window.setTimeout(function () {
        document.body.classList.add("is-intro-unsealing");
        window.setTimeout(beginExit, INTRO_UNSEAL_MS);
      }, INTRO_HOLD_MS);
    }

    function tick(timestamp) {
      if (!introStartedAt) {
        introStartedAt = timestamp;
      }

      var elapsed = timestamp - introStartedAt;
      var ratio = Math.max(0, Math.min(1, elapsed / INTRO_LOADING_MS));
      var percent = Math.max(1, Math.min(100, Math.round(ratio * 100)));

      setIntroProgress(percent);

      if (ratio >= 1) {
        beginUnseal();
        return;
      }

      window.requestAnimationFrame(tick);
    }

    window.requestAnimationFrame(tick);
  }

  function init() {
    renderAllSections();
    bindNavigation();
    bindPhilosophy();
    bindArtifacts();
    bindGallery();
    setupRevealObserver();
    setupSectionObserver();
    setupParallax();
    bindMediaChange(mediaQueries.mobile, handleMediaChange);
    bindMediaChange(mediaQueries.reducedMotion, handleMediaChange);
    playIntro();
  }

  init();
})();
