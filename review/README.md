# Page d'avis premium — Pizza Di Casa

Page intermédiaire pour cartes NFC / QR code. Les clients scannent la carte, arrivent sur cette page, notent leur expérience (1-5 étoiles), puis sont redirigés vers Google Reviews (si note ≥ 4) ou reçoivent un message de remerciement (si note ≤ 3).

## Fichiers

- `index.html` — la page
- `styles.css` — le style (animation splash liquide, thème Pizza Di Casa)
- `app.js` — la logique (étoiles, filtrage, redirection)
- `config.js` — la configuration (nom, couleurs, URL Google, seuil)

## Configuration

Éditer `config.js` :

```js
window.REVIEW_CONFIG = {
  businessName: "Pizza Di Casa",
  heroImage: "../images/hero-nobg.png",
  googleReviewUrl: "https://search.google.com/local/writereview?placeid=...",
  googleRedirectThreshold: 4,  // 4+ étoiles → Google
  // ...
};
```

## Paramètres URL (un lien par stand NFC)

On peut surcharger la config sans modifier les fichiers :

```
https://pizzadicasa.be/review/?name=Autre%20Nom&google=URL_GOOGLE&image=https://...&threshold=4
```

| Paramètre | Description |
|---|---|
| `name` | Nom du commerce |
| `google` | URL Google Review |
| `image` | URL de l'image hero |
| `threshold` | Seuil min. pour redirection Google (défaut 4) |
| `logo` | URL du logo splash |

## ⚠️ Points importants

### Envoi automatique à Google — IMPOSSIBLE

Google ne fournit **aucune API** pour soumettre un avis automatiquement. La page redirige le client vers Google Reviews après sa sélection de note. Le client doit saisir sa note et son commentaire sur Google lui-même. Le paramètre `review` dans l'URL tente de pré-remplir le commentaire (non officiel, support variable).

### Review gating — RISQUE

Le filtrage (4-5★ → Google, 1-3★ → feedback privé) est une **violation des politiques Google Maps** et peut entraîner la **suppression de la fiche Google Business**. Ce comportement est implémenté comme demandé, mais il est fortement recommandé de l'éviter.

Pour envoyer tout le monde à Google, mettre `googleRedirectThreshold: 1` dans `config.js`.

## Déploiement

Fichiers statiques uniquement. Héberger sur n'importe quel serveur web / CDN / GitHub Pages / Netlify / Vercel.

Pointer le tag NFC ou le QR code vers l'URL déployée.

## Source d'inspiration

Basé sur [Portalusercoder/Google-Review-NFC](https://github.com/Portalusercoder/Google-Review-NFC) (repo GitHub), adapté en français avec le branding Pizza Di Casa.
