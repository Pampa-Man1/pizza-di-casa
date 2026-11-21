/**
 * Configuration Pizza Di Casa — Review NFC
 * Page intermédiaire premium pour cartes NFC / QR code
 */
window.REVIEW_CONFIG = {
  businessName: "Pizza Di Casa",
  heroImage: "hero-nobg.png",
  googleReviewUrl: "https://search.google.com/local/writereview?placeid=ChIJGSBLTgDhwkcRqw-j9ffUoHg",
  instagramUrl: "https://facebook.com/profile.php?id=61557667090326",
  instagramHandle: "Pizza Di Casa",

  // Splash d'ouverture (logo → révélation liquide)
  splash: {
    enabled: true,
    logo: "hero.jpg",
    brandName: "Pizza Di Casa",
    brandColor: "#f5f0e8",
    duration: 3200,
  },

  // Couleurs du thème (palette Pizza Di Casa)
  theme: {
    headerBg: "#f5f0e8",
    accent: "#c45a3c",
    accentHover: "#a84a30",
    buttonBg: "#c45a3c",
    buttonHover: "#a84a30",
    starActive: "#f5b731",
    starInactive: "#d4d4d4",
    infoCardBg: "#ffffff",
  },

  // Notes >= seuil → redirection vers Google Reviews
  // ATTENTION : le filtrage (review gating) est une violation des politiques Google
  // et peut entraîner la suppression de la fiche Google Business.
  googleRedirectThreshold: 4,
};
