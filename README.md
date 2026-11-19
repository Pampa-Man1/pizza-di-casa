# Pizza Di Casa — Site web

Site vitrine pour Pizza Di Casa, pizzeria napolitaine au feu de bois à Tournai (Belgique).

## Fichiers

- `index.html` — Accueil (hero, menu highlights, histoire, fidélité, avis, contact)
- `menu.html` — Carte complète (35 pizzas, base tomate + base crème ricotta)
- `commande.html` — Commander en ligne (à emporter / livraison)
- `contact.html` — Contact, horaires, formulaire, carte Google Maps
- `avis.html` — Collecte d'avis Google (page cible NFC/QR)
- `histoire.html` — Histoire de David et Charly
- `evenements.html` — Pizza du mois, promo fidélité
- `mentions-legales.html` — Mentions légales (champs [À COMPLÉTER])
- `politique-confidentialite.html` — Politique de confidentialité (RGPD)
- `styles.css` — Styles partagés (tokens, composants, responsive)
- `script.js` — Scripts partagés (menu mobile, cookies, reveal, formulaires, créneaux horaires)

## Stack

- HTML statique + CSS custom (pas de framework)
- Google Fonts (Fraunces + Manrope)
- Images : photos réelles de l'établissement (CDN Webador, à re-héberger)
- Formulaire : FormSubmit (email) → info@pizzadicasa.be
- Carte : Google Maps iframe
- Hébergement prévu : Cloudflare Pages (ou Vercel/Netlify)

## Design

- Skill **Hallmark** (anti-AI-slop) : tokens CSS, pas d'eyebrows, pas de labels en capitales, pas de card-in-card, pas de gradients purple-blue, prefers-reduced-motion, focus-visible, overflow-x: clip.
- Typographie : Fraunces (titres) + Manrope (corps). Pas d'Inter/Geist.
- Palette : crème chaud, encre brune, terracotta, or. Pas de violet/bleu.

## À configurer avant livraison

1. **FormSubmit** : les formulaires envoient à `info@pizzadicasa.be`. La première soumission envoie un email de confirmation — cliquer sur le lien pour activer. Ensuite chaque soumission envoie un email direct.
2. **Google Review** : récupérer le lien via Google Business Profile → "Demander des avis", remplacer `VOTRE_LIEN_GOOGLE_REVIEW` dans `avis.html`.
3. **Coordonnées** : vérifier téléphone, email, adresse dans tous les fichiers.
4. **Photos** : re-héberger les photos (actuellement sur CDN Webador). Remplacer les URLs par des chemins locaux (`images/`).
5. **Réseaux sociaux** : le site pointe vers le profil Facebook personnel existant (conservé tel quel). Remplacer le lien uniquement si le client en fournit un nouveau.
6. **Infos légales** : voir `LEGAL-KIT.md` (audit + email prêt à envoyer au client + liste des champs [À COMPLÉTER]). Remplir les champs [À COMPLÉTER] dans mentions-legales.html et politique-confidentialite.html (forme juridique, BCE, TVA, hébergeur, email, date).
7. **NFC / QR** : programmer les cartes NFC avec l'URL `https://<domaine>/avis.html`.

## Placeholders à remplacer

- `info@pizzadicasa.be` → vrai email du commerce (si différent)
- `+32 498 23 77 37` → vrai numéro
- `49 Rue Royale, 7500 Tournai` → vraie adresse
- `VOTRE_LIEN_GOOGLE_REVIEW` → lien Google Review
- `[À COMPLÉTER]` dans mentions-legales.html et politique-confidentialite.html
- `[votre nom]` dans le footer credit
- URLs photos Webador → chemins locaux

## Hébergement recommandé

**Cloudflare Pages** (gratuit, CDN mondial, SSL auto, analytics sans cookies).

Déploiement : connecter le repo GitHub ou drag-and-drop du dossier.

## Checklist qualité

- [ ] Contrastes suffisants
- [ ] Navigation clavier fonctionnelle
- [ ] Responsive mobile testé
- [ ] Images avec alt text
- [ ] Formulaire avec labels
- [ ] prefers-reduced-motion respecté
- [ ] Meta description présente
- [ ] Schema.org (Restaurant, Menu, Review)
- [ ] Mentions légales + politique de confidentialité + cookie banner
- [ ] Pas de photos Unsplash (photos réelles de l'établissement)
- [ ] sloplint passé (si Node disponible)

## Leçons du site existant (Webador)

1. **Téléphone manquant** → corrigé : click-to-call + WhatsApp en nav et footer
2. **Pas de réservation/commande** → corrigé : formulaire commande + réservation
3. **Menu en images** → corrigé : menu en texte structuré avec catégories et prix alignés
4. **Facebook = profil perso** → à corriger : créer une page professionnelle
5. **Pas de mentions légales** → corrigé : pages légales avec placeholders
6. **Pas de carte** → corrigé : iframe Google Maps
7. **Pas de CTA** → corrigé : bouton "Commander" en nav + hero
8. **Commentaires abandonnés** → supprimés (pas de section commentaires)
