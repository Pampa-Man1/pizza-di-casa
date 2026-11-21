(function () {
  "use strict";

  const params = new URLSearchParams(window.location.search);
  const config = { ...window.REVIEW_CONFIG };

  // Surcharges via paramètres URL (un lien par stand NFC/QR)
  if (params.get("name")) config.businessName = params.get("name");
  if (params.get("image")) config.heroImage = params.get("image");
  if (params.get("google")) config.googleReviewUrl = params.get("google");
  if (params.get("threshold")) {
    config.googleRedirectThreshold = parseInt(params.get("threshold"), 10);
  }
  if (params.get("logo")) config.splash = { ...config.splash, logo: params.get("logo") };

  const theme = config.theme || {};
  const splash = config.splash || {};
  const root = document.documentElement;
  if (theme.headerBg) root.style.setProperty("--header-bg", theme.headerBg);
  if (theme.accent) root.style.setProperty("--accent", theme.accent);
  if (theme.accentHover) root.style.setProperty("--accent-hover", theme.accentHover);
  if (theme.buttonBg) root.style.setProperty("--button-bg", theme.buttonBg);
  if (theme.buttonHover) root.style.setProperty("--button-hover", theme.buttonHover);
  if (theme.starActive) root.style.setProperty("--star-active", theme.starActive);
  if (theme.starInactive) root.style.setProperty("--star-inactive", theme.starInactive);
  if (theme.infoCardBg) root.style.setProperty("--info-card-bg", theme.infoCardBg);
  if (theme.headerBg) root.style.setProperty("--page-bg", theme.headerBg);
  if (splash.brandColor) root.style.setProperty("--splash-color", splash.brandColor);

  initSplash(splash);

  const businessName = config.businessName;
  document.title = `Avis — ${businessName}`;
  document.getElementById("businessName").textContent = businessName;
  document.getElementById("businessSubtitle").textContent =
    `Comment s'est passée votre expérience chez ${businessName} ?`;

  const heroImg = document.getElementById("heroImage");
  heroImg.src = config.heroImage;
  heroImg.alt = businessName;

  const socialLink = document.getElementById("socialLink");
  if (config.instagramUrl && socialLink) {
    socialLink.href = config.instagramUrl;
  } else if (socialLink) {
    socialLink.hidden = true;
  }

  let selectedRating = 0;

  const stars = document.querySelectorAll(".star");
  const submitBtn = document.getElementById("submitBtn");
  const commentInput = document.getElementById("comment");
  const charCount = document.getElementById("charCount");
  const form = document.getElementById("feedbackForm");
  const overlay = document.getElementById("overlay");
  const overlayTitle = document.getElementById("overlayTitle");
  const overlayText = document.getElementById("overlayText");
  const overlayBtn = document.getElementById("overlayBtn");
  const overlayEmoji = document.getElementById("overlayEmoji");

  function updateStars(rating, isHover) {
    stars.forEach((star) => {
      const value = parseInt(star.dataset.value, 10);
      star.classList.toggle("active", !isHover && value <= selectedRating);
      star.classList.toggle("hovered", isHover && value <= rating);
    });
  }

  stars.forEach((star) => {
    star.addEventListener("click", () => {
      selectedRating = parseInt(star.dataset.value, 10);
      updateStars(selectedRating, false);
      submitBtn.disabled = false;
    });

    star.addEventListener("mouseenter", () => {
      updateStars(parseInt(star.dataset.value, 10), true);
    });
  });

  document.getElementById("stars").addEventListener("mouseleave", () => {
    updateStars(selectedRating, false);
  });

  commentInput.addEventListener("input", () => {
    charCount.textContent = `${commentInput.value.length}/1000`;
  });

  function showOverlay({ emoji, title, text, showGoogleBtn, spinner }) {
    overlayEmoji.textContent = emoji;
    overlayTitle.textContent = title;
    overlayText.textContent = text;
    overlayBtn.hidden = !showGoogleBtn;
    if (spinner) {
      overlayBtn.innerHTML = '<span class="overlay__spinner"></span>Redirection vers Google…';
    } else {
      overlayBtn.textContent = "Laisser un avis Google";
    }
    overlay.hidden = false;
  }

  overlayBtn.addEventListener("click", () => {
    redirectToGoogle();
  });

  function buildGoogleUrl() {
    // NOTE : Google ne fournit aucune API pour soumettre un avis automatiquement.
    // On tente de pré-remplir le commentaire via le paramètre "review" (non officiel,
    // support variable). La note (étoiles) ne peut pas être pré-remplie.
    const comment = commentInput.value.trim();
    let url = config.googleReviewUrl;
    if (comment) {
      const separator = url.includes("?") ? "&" : "?";
      url += `${separator}review=${encodeURIComponent(comment)}`;
    }
    return url;
  }

  function redirectToGoogle() {
    window.location.href = buildGoogleUrl();
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!selectedRating) return;

    const comment = commentInput.value.trim();
    const threshold = config.googleRedirectThreshold || 4;

    // Filtrage (review gating) : 4-5★ → Google, 1-3★ → feedback privé
    // ATTENTION : ce comportement est une violation des politiques Google Maps
    // et peut entraîner la suppression de la fiche Google Business.
    if (selectedRating >= threshold) {
      showOverlay({
        emoji: "⭐",
        title: "Merci pour votre retour !",
        text: "Nous sommes ravis que vous ayez apprécié votre expérience. Votre avis sur Google nous aide énormément. Redirection en cours…",
        showGoogleBtn: true,
        spinner: true,
      });

      // Log du feedback (à connecter à un backend si besoin)
      console.log("Feedback positif :", { rating: selectedRating, comment, business: businessName });

      // Redirection automatique vers Google après 2 secondes
      setTimeout(() => {
        redirectToGoogle();
      }, 2000);
    } else {
      showOverlay({
        emoji: "🙏",
        title: "Merci pour votre retour",
        text: "Nous sommes désolés de ne pas avoir pleinement répondu à vos attentes. Vos commentaires nous aident à nous améliorer.",
        showGoogleBtn: false,
      });

      // Log du feedback privé (à connecter à un backend si besoin)
      console.log("Feedback privé :", { rating: selectedRating, comment, business: businessName });
    }
  });

  function initSplash(splashConfig) {
    const splashEl = document.getElementById("splash");
    if (!splashEl) return;

    const enabled = splashConfig.enabled !== false;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!enabled || reducedMotion) {
      splashEl.remove();
      document.body.classList.remove("splash-active");
      document.body.classList.add("splash-done");
      return;
    }

    const splashLogo = document.getElementById("splashLogo");
    if (splashConfig.logo && splashLogo) {
      splashLogo.src = splashConfig.logo;
      splashLogo.alt = splashConfig.brandName || "Logo";
    }

    const splashBrand = document.getElementById("splashBrandName");
    if (splashConfig.brandName && splashBrand) {
      splashBrand.textContent = splashConfig.brandName;
      splashBrand.hidden = false;
    } else if (splashBrand) {
      splashBrand.hidden = true;
    }

    const holdMs = 1100;
    const exitMs = splashConfig.duration || 3200;

    setTimeout(() => {
      splashEl.classList.add("is-exiting");
      document.body.classList.add("splash-done");
    }, holdMs);

    setTimeout(() => {
      splashEl.classList.add("is-done");
      document.body.classList.remove("splash-active");
      splashEl.setAttribute("aria-hidden", "true");
    }, exitMs);

    setTimeout(() => splashEl.remove(), exitMs + 400);
  }
})();
