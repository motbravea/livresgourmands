// =====================================================================
// Génération du Rapport Étape 3 — livresgourmands.net
// Sortie : docs/Rapport_Etape3.pdf
// =====================================================================
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const DOCS = path.join(ROOT, 'docs');
const OUTPUT = path.join(DOCS, 'Rapport_Etape3.pdf');

// Image Figma (à fournir par l'utilisateur). On essaie plusieurs noms
// usuels pour rester robuste.
const FIGMA_CANDIDATES = [
  path.join(DOCS, 'figma-maquettes.png'),
  path.join(DOCS, 'figma-maquettes.jpg'),
  path.join(DOCS, 'figma.png'),
  path.join(DOCS, 'maquettes-figma.png'),
];
const figmaImage = FIGMA_CANDIDATES.find((p) => fs.existsSync(p)) || null;

// ---------- Couleurs (alignées sur l'identité visuelle) ----------
const COLOR = {
  forest: '#1f4d3a',
  ink: '#133024',
  gold: '#a8893f',
  goldSoft: '#c9a961',
  text: '#1a2620',
  muted: '#5a6a60',
  border: '#d8d2c0',
  cream: '#faf7f2',
};

const doc = new PDFDocument({
  size: 'A4',
  margins: { top: 60, bottom: 60, left: 60, right: 60 },
  info: {
    Title: 'Rapport Étape 3 — livresgourmands.net',
    Author: 'Khalid Asseffar & Youness Bellouk',
    Subject: 'Conception visuelle et intégration front-end / back-end',
    Keywords: 'React, Node.js, Express, MySQL, JWT, UX, UI, e-commerce',
  },
});

doc.pipe(fs.createWriteStream(OUTPUT));

// ---------- Helpers ----------
function h1(txt) {
  doc.moveDown(0.4);
  doc.font('Helvetica-Bold').fontSize(15).fillColor(COLOR.forest).text(txt);
  // filet doré sous le titre
  const y = doc.y + 2;
  doc.moveTo(60, y).lineTo(180, y).lineWidth(1).strokeColor(COLOR.gold).stroke();
  doc.moveDown(0.6);
  doc.fillColor(COLOR.text);
}
function p(txt, opts = {}) {
  doc
    .font('Helvetica')
    .fontSize(10.2)
    .fillColor(COLOR.text)
    .text(txt, { align: 'justify', lineGap: 1.6, ...opts });
  doc.moveDown(0.45);
}
function bullets(items) {
  doc.font('Helvetica').fontSize(10.2).fillColor(COLOR.text);
  items.forEach((it) => {
    doc.text(`•  ${it}`, { indent: 14, lineGap: 1.4, align: 'left' });
  });
  doc.moveDown(0.45);
}
function meta(label, value) {
  doc
    .font('Helvetica-Bold').fontSize(10).fillColor(COLOR.muted)
    .text(label.toUpperCase(), { continued: true });
  doc
    .font('Helvetica').fontSize(10.5).fillColor(COLOR.ink)
    .text('   ' + value);
  doc.moveDown(0.35);
}

// =====================================================================
// PAGE DE TITRE
// =====================================================================

// Cadre crème en haut
doc.rect(0, 0, doc.page.width, 220).fill(COLOR.cream);
// Filet doré
doc.moveTo(60, 220).lineTo(doc.page.width - 60, 220).lineWidth(2).strokeColor(COLOR.gold).stroke();

doc.fillColor(COLOR.ink);
doc.font('Helvetica').fontSize(11).fillColor(COLOR.gold)
  .text('LIVRES GOURMANDS · MAISON FONDÉE EN 2025', 60, 75, { characterSpacing: 2 });

doc.moveDown(0.8);
doc.font('Helvetica-Bold').fontSize(26).fillColor(COLOR.forest)
  .text('Rapport de conception', 60, 110);
doc.font('Helvetica').fontSize(20).fillColor(COLOR.ink)
  .text('Étape 3 — Conception visuelle', 60, 145);
doc.fontSize(20).fillColor(COLOR.ink)
  .text('et intégration front-end / back-end', 60, 170);

// Bloc d'informations
doc.y = 260;
doc.x = 60;

meta('Projet', 'livresgourmands.net');
meta('Cours', 'Programmation Web avancée');
meta('Enseignante', 'Kahina Tamazouzt');
meta('Membres', 'Khalid Asseffar et Youness Bellouk');
meta('Session', 'Hiver 2026');

doc.moveDown(1);
doc.font('Helvetica-Oblique').fontSize(10).fillColor(COLOR.muted)
  .text(
    "Ce dossier présente les choix de conception visuelle, l'organisation du frontend React, " +
    "ainsi que l'intégration avec l'API REST Node.js / Express / MySQL développée lors de l'étape précédente.",
    { align: 'justify' }
  );

// Filet bas
const yBottom = doc.page.height - 90;
doc.moveTo(60, yBottom).lineTo(doc.page.width - 60, yBottom).lineWidth(0.7).strokeColor(COLOR.border).stroke();
doc.font('Helvetica').fontSize(8.5).fillColor(COLOR.muted)
  .text('Dossier remis dans le cadre du cours Programmation Web avancée', 60, yBottom + 8, {
    width: doc.page.width - 120, align: 'center'
  });

// =====================================================================
// PAGE 2 — Contenu principal
// =====================================================================
doc.addPage();

h1('1. Introduction');
p(
  "Le projet livresgourmands.net est une plateforme e-commerce dédiée à la vente de livres de cuisine. " +
  "Après avoir conçu les diagrammes UML lors de la première étape, puis développé une API REST sécurisée " +
  "en Node.js, Express et MySQL lors de la deuxième, cette troisième étape consiste à donner au projet " +
  "une véritable interface utilisateur. Nous passons donc d'une API testable uniquement avec Postman " +
  "à une plateforme web complète, avec un frontend React connecté à notre backend."
);

h1("2. Objectif de l'étape 3");
p(
  "L'objectif principal était de concevoir une expérience utilisateur claire, moderne et fonctionnelle. " +
  "Concrètement, nous devions réaliser des maquettes visuelles, développer un frontend React, " +
  "le connecter à notre API REST via Axios, gérer un panier dynamique avec persistance, et offrir " +
  "un espace administrateur permettant de gérer le catalogue. L'idée n'est pas seulement de \"brancher\" " +
  "l'interface au backend, mais de proposer un site qui ressemble vraiment à une librairie en ligne professionnelle."
);

h1('3. Identité visuelle');
p(
  "Nous avons choisi un style premium qui évoque une librairie haut de gamme spécialisée en gastronomie. " +
  "L'identité repose sur trois couleurs : un vert forêt profond comme couleur principale, un doré chaud " +
  "comme accent, et un fond crème presque blanc pour aérer l'ensemble. Ces trois teintes proviennent " +
  "directement du logo, qui représente un livre ouvert surmonté d'une toque, d'une fourchette et d'une cuillère."
);
p(
  "La typographie associe une serif élégante (Cormorant Garamond) pour les titres et une sans serif " +
  "lisible (Inter) pour le texte courant. Les cartes ont des coins arrondis, des ombres très douces, " +
  "et les boutons utilisent des dégradés discrets. L'objectif est de donner une impression " +
  "luxueuse sans nuire à la lisibilité."
);

h1('4. Maquettes Figma');
p(
  "Les maquettes ont été réalisées dans Figma à partir du frontend final, afin de visualiser la mise " +
  "en page de chaque écran avant et après le développement. Nous avons préparé les vues suivantes :"
);
bullets([
  'Accueil desktop et mobile',
  'Catalogue / Ouvrages desktop et mobile',
  "Détail d'un ouvrage",
  'Panier desktop et mobile',
  'Connexion et inscription',
  'Dashboard administrateur',
  'Gestion des ouvrages (CRUD)',
]);
p(
  "Ces maquettes nous ont aidés à valider la hiérarchie des informations, l'espacement entre les sections " +
  "et le comportement responsive. La capture ci-dessous présente une vue d'ensemble du board Figma " +
  "regroupant les principaux écrans."
);

// ----- Image Figma (si disponible) -----
if (figmaImage) {
  try {
    const availableWidth = doc.page.width - 120;     // largeur utile
    const maxHeight = 460;                            // hauteur max pour rester lisible

    // Calcul du ratio réel de l'image pour éviter toute déformation/crop
    const img = doc.openImage(figmaImage);
    const ratio = img.height / img.width;

    let renderWidth = availableWidth;
    let renderHeight = renderWidth * ratio;
    if (renderHeight > maxHeight) {
      renderHeight = maxHeight;
      renderWidth = renderHeight / ratio;
    }
    const renderX = (doc.page.width - renderWidth) / 2;  // centrage horizontal

    // Saut de page si l'image + légende ne tient pas sur la page courante
    const remaining = doc.page.height - doc.page.margins.bottom - doc.y;
    if (remaining < renderHeight + 30) {
      doc.addPage();
    }

    const yImg = doc.y;
    doc.image(figmaImage, renderX, yImg, { width: renderWidth });
    doc.y = yImg + renderHeight + 8;

    doc.font('Helvetica-Oblique').fontSize(9).fillColor(COLOR.muted)
      .text("Figure 1 — Vue d'ensemble du board Figma (desktop + mobile)", { align: 'center' });
    doc.moveDown(0.8);
  } catch (e) {
    doc.font('Helvetica-Oblique').fontSize(9).fillColor(COLOR.muted)
      .text('[Maquette Figma — image indisponible : ' + e.message + ']', { align: 'center' });
    doc.moveDown(0.6);
  }
} else {
  // Placeholder élégant
  const boxY = doc.y;
  const boxH = 180;
  doc.rect(60, boxY, doc.page.width - 120, boxH).lineWidth(0.8).strokeColor(COLOR.border).dash(4, { space: 3 }).stroke().undash();
  doc.font('Helvetica-Oblique').fontSize(10).fillColor(COLOR.muted)
    .text(
      "Vue d'ensemble des maquettes Figma\n(image à insérer : docs/figma-maquettes.png)",
      60, boxY + boxH / 2 - 18,
      { width: doc.page.width - 120, align: 'center' }
    );
  doc.y = boxY + boxH + 10;
}

// ---- Sections suivantes : on laisse la pagination naturelle ----

h1('5. Parcours utilisateur');
p(
  "Trois parcours ont guidé la conception. Le premier est celui du visiteur curieux : il arrive sur la " +
  "page d'accueil, découvre une sélection d'ouvrages, parcourt les catégories et consulte une fiche produit. " +
  "Le second parcours est celui du client : il ajoute un ouvrage au panier, modifie la quantité, " +
  "consulte le total, puis se connecte ou crée un compte. Enfin, l'administrateur peut se connecter " +
  "à un dashboard dédié et gérer les ouvrages et catégories en temps réel."
);
p(
  "Nous n'avons pas réalisé de prototype Adobe XD séparé. Le frontend React étant fonctionnel et connecté " +
  "à la base de données, il permet de démontrer directement toutes les interactions lors de la vidéo de " +
  "démonstration. Cette approche nous a semblé plus représentative du projet réel qu'un prototype statique."
);

h1('6. Structure du frontend React');
p(
  "Le frontend est organisé en dossiers clairs, chacun avec une responsabilité précise :"
);
bullets([
  'components/ — éléments réutilisables (Navbar, Footer, BookCard, Logo, ProtectedRoute)',
  'pages/ — une page par route, avec son fichier CSS dédié',
  'context/ — AuthContext (utilisateur connecté) et CartContext (panier)',
  'services/ — api.js, instance Axios partagée avec intercepteur JWT',
  'layouts/ — MainLayout (site public) et AdminLayout (dashboard)',
  'assets/ — logo et ressources statiques',
]);
p(
  "Cette séparation rend le projet plus simple à maintenir et permet de retrouver rapidement où se trouve " +
  "chaque morceau de logique."
);

h1('7. Pages développées');
bullets([
  "Accueil : section hero animée, sélection d'ouvrages, catégories, bloc éditorial.",
  "Catalogue (Ouvrages) : liste complète avec recherche par titre ou auteur, filtre par catégorie et tri.",
  "Détail d'un ouvrage : informations complètes, gestion de la quantité, ajout au panier.",
  "Panier : items dynamiques, modification des quantités, total recalculé en direct.",
  "Connexion et inscription : formulaires reliés à l'API d'authentification.",
  "Dashboard administrateur : statistiques globales, accès rapide aux modules de gestion.",
  "Gestion CRUD des ouvrages et des catégories : tableau, drawer latéral pour création / édition, suppression.",
]);

h1('8. Intégration avec le backend');
p(
  "Le frontend communique avec l'API Node.js / Express via une instance Axios configurée dans " +
  "services/api.js. La baseURL pointe vers http://localhost:3000/api. Un intercepteur attache " +
  "automatiquement le token JWT lorsqu'il est présent dans le localStorage, ce qui évite de répéter " +
  "ce code à chaque appel."
);
p('Endpoints principaux utilisés :');
bullets([
  'GET /api/ouvrages — liste des ouvrages (avec nom de catégorie joint)',
  'GET /api/ouvrages/:id — détail d\'un ouvrage',
  'GET /api/categories — liste des catégories',
  'POST /api/auth/login — connexion et récupération du JWT',
  'POST /api/auth/register — création de compte',
  'POST / PUT / DELETE /api/ouvrages — administration du catalogue (rôle admin)',
  'POST / PUT / DELETE /api/categories — administration des catégories (rôle admin)',
]);
p(
  "Les données affichées ne sont jamais codées en dur : elles viennent toutes de la base MySQL via l'API. " +
  "Si le backend n'est pas démarré, le frontend affiche un message d'erreur clair au lieu de planter."
);

// ---- Pagination naturelle pour la suite ----

h1('9. Gestion du panier');
p(
  "Le panier est entièrement géré côté frontend grâce à la Context API de React. Un CartContext expose " +
  "les fonctions addToCart, removeFromCart, updateQuantity et clearCart, ainsi qu'un total et un compteur " +
  "d'articles calculés automatiquement. À chaque modification, l'état du panier est sauvegardé dans le " +
  "localStorage du navigateur. L'utilisateur peut donc fermer l'onglet et revenir : son panier est toujours là."
);
p(
  "Cette approche évite de surcharger le backend tant que l'utilisateur n'a pas validé sa commande, " +
  "tout en offrant une expérience fluide."
);

h1('10. Authentification et espace administrateur');
p(
  "L'authentification repose sur des tokens JWT générés par le backend lors du login. Le frontend stocke " +
  "le token dans le localStorage, puis le réutilise pour chaque requête nécessitant une autorisation. " +
  "Un AuthContext suit en permanence l'utilisateur connecté et son rôle."
);
p(
  "Les routes administrateur (/admin, /admin/ouvrages, /admin/categories) sont protégées par un composant " +
  "ProtectedRoute. Si l'utilisateur n'est pas connecté, il est redirigé vers la page de connexion ; " +
  "s'il n'a pas le rôle administrateur, il est redirigé vers l'accueil. Le dashboard offre une vue " +
  "d'ensemble avec des cartes statistiques (nombre d'ouvrages, catégories, stock total) et des tableaux " +
  "CRUD complets pour gérer le catalogue."
);

h1('11. Responsive design et accessibilité');
p(
  "L'ensemble du site a été pensé pour s'adapter aussi bien aux écrans desktop qu'aux téléphones. " +
  "Les grilles passent automatiquement de plusieurs colonnes à une seule, le menu de navigation se " +
  "transforme en menu burger en dessous de 960 pixels, et les images conservent leurs proportions. " +
  "Côté accessibilité, nous avons veillé à des contrastes suffisants entre texte et fond, à des boutons " +
  "clairement identifiables, à des labels pour chaque champ de formulaire, et à des aria-label sur les " +
  "icônes interactives comme le panier."
);

h1('12. Limites et améliorations possibles');
p(
  "Le projet reste un travail scolaire, et plusieurs points pourraient encore être améliorés :"
);
bullets([
  "Adobe XD n'a pas été utilisé comme prototype séparé — le frontend fonctionnel sert de prototype interactif.",
  "Le paiement n'est pas réellement implémenté : le bouton \"Passer commande\" est volontairement désactivé.",
  "La gestion complète des commandes côté administrateur reste à développer.",
  "Les avis et commentaires sur les ouvrages sont prévus dans la base de données mais pas encore exposés côté frontend.",
  "Le filtrage pourrait être enrichi (fourchette de prix, plusieurs catégories à la fois).",
]);

h1('13. Conclusion');
p(
  "L'étape 3 nous a permis de relier toutes les pièces du projet : la modélisation faite à l'étape 1, " +
  "l'API sécurisée développée à l'étape 2, et maintenant une interface utilisateur React moderne et " +
  "responsive. Nous sommes passés d'un projet purement technique à une vraie expérience visuelle, " +
  "proche de ce qu'on retrouve sur une plateforme e-commerce réelle."
);
p(
  "Au-delà du code, cette étape nous a surtout fait travailler la cohérence entre design, ergonomie " +
  "et intégration : choisir des couleurs en accord avec le logo, organiser les composants React de " +
  "manière maintenable, gérer correctement l'état global avec la Context API et les bonnes pratiques " +
  "de sécurité côté token. Le résultat est une base solide, prête à évoluer."
);

// ---------- Pied de page ----------
const range = doc.bufferedPageRange();
for (let i = range.start; i < range.start + range.count; i++) {
  doc.switchToPage(i);
  if (i === 0) continue; // pas de pied sur la page de titre
  const yFoot = doc.page.height - 40;
  doc.moveTo(60, yFoot).lineTo(doc.page.width - 60, yFoot).lineWidth(0.5).strokeColor(COLOR.border).stroke();
  doc.font('Helvetica').fontSize(8.5).fillColor(COLOR.muted)
    .text('livresgourmands.net — Rapport Étape 3', 60, yFoot + 6, { continued: true })
    .text('   |   K. Asseffar & Y. Bellouk', { continued: true })
    .text('   |   Page ' + (i + 1) + ' / ' + (range.start + range.count), { align: 'right' });
}

doc.end();
console.log('PDF généré : ' + OUTPUT);
console.log('Image Figma embarquée : ' + (figmaImage ? figmaImage : 'aucune (placeholder utilisé)'));
