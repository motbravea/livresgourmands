# Projet : livresgourmands.net

## 1. Présentation

Ce projet consiste en la conception et le développement complet d'une plateforme web pour une librairie haut de gamme spécialisée dans les ouvrages de cuisine et de gastronomie.

L'application permet :
- l'inscription et l'authentification des utilisateurs
- la gestion des rôles (client, éditeur, gestionnaire, administrateur)
- la gestion des catégories
- la gestion des ouvrages (livres)
- la sécurisation des accès via JWT
- un frontend React premium avec panier dynamique et dashboard admin

Ce projet a été réalisé dans le cadre du cours *Programmation Web avancée*.

---

## 2. Membres de l'équipe

- Khalid Asseffar
- Youness Bellouk

---

## 3. Technologies utilisées

**Backend**
- Node.js, Express.js
- MySQL
- JWT (authentification)
- bcrypt (sécurité des mots de passe)
- Postman (tests API)

**Frontend (Étape 3)**
- React 19 + Vite
- React Router DOM v7
- Axios (communication API)
- Context API (état global panier & auth)
- localStorage (persistance panier et token JWT)
- Framer Motion (animations)
- Bootstrap (utilitaires) + design system CSS sur-mesure

---

## 4. Structure du projet

```
livresgourmands/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   └── app.js
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/      # Navbar, Footer, BookCard, ProtectedRoute
│   │   ├── context/         # AuthContext, CartContext
│   │   ├── layouts/         # MainLayout, AdminLayout
│   │   ├── pages/           # Home, Ouvrages, ProductDetails, Cart, Login, Register, Categories
│   │   │   └── admin/       # AdminOverview, AdminOuvrages, AdminCategories
│   │   ├── services/        # api.js (Axios + JWT interceptor)
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── sql/
│   └── database.sql
│
├── diagrammes/
├── docs/
└── README.md
```

---

## 5. Installation et exécution

### 5.1 Cloner le projet
```bash
git clone <URL_DU_REPO>
cd livresgourmands
```

### 5.2 Base de données
Ouvrir MySQL Workbench et exécuter le schéma :
```sql
SOURCE sql/database.sql;
```
Puis charger les données de démonstration (6 catégories + 8 ouvrages) :
```sql
SOURCE sql/seed.sql;
```
Vérifier que la base `livresgourmands` est créée et peuplée.

### 5.3 Backend
```bash
cd backend
npm install
node server.js
```
L'API sera accessible sur **http://localhost:3000**.

### 5.4 Frontend
Dans un nouveau terminal :
```bash
cd frontend
npm install
npm run dev
```
Le frontend sera accessible sur **http://localhost:5173** (Vite).

---

## 6. Pages du frontend

| Route | Description |
|-------|-------------|
| `/` | Accueil — hero premium, sélections, catégories, éditorial |
| `/ouvrages` | Catalogue complet avec recherche, filtres et tri |
| `/ouvrages/:id` | Fiche produit luxueuse (description, stock, prix, panier, liés) |
| `/panier` | Panier dynamique (Context API + localStorage) |
| `/categories` | Catégories avec sélection et résultats filtrés |
| `/login` | Connexion (JWT stocké en localStorage) |
| `/register` | Création de compte |
| `/admin` | Tableau de bord (protégé) — vue d'ensemble + statistiques |
| `/admin/ouvrages` | CRUD complet des ouvrages |
| `/admin/categories` | CRUD complet des catégories |

---

## 7. Architecture frontend

### Axios (`src/services/api.js`)
- Instance configurée avec `baseURL: http://localhost:3000/api`
- **Intercepteur de requête** : ajoute automatiquement le `Authorization: Bearer <token>` si un JWT est présent en localStorage
- **Intercepteur de réponse** : normalise les messages d'erreur pour un affichage propre
- Helpers exportés : `authApi`, `ouvragesApi`, `categoriesApi`

### Context API
- **AuthContext** (`src/context/AuthContext.jsx`) : `login`, `register`, `logout`, persistance du token et du user, décodage JWT, rôles (`isAdmin`)
- **CartContext** (`src/context/CartContext.jsx`) : `addToCart`, `removeFromCart`, `updateQuantity`, `clearCart`, `total`, `count`, persistance automatique en localStorage

### localStorage
- `lg_token` : JWT après connexion
- `lg_user` : objet utilisateur (id, role, email)
- `lg_cart` : tableau d'articles du panier (synchronisé via `useEffect`)

### Routes protégées
- `<ProtectedRoute adminOnly>` redirige vers `/login` si non connecté, vers `/` si non admin

---

## 8. Endpoints API consommés

**Auth**
- `POST /api/auth/register`
- `POST /api/auth/login`

**Catégories**
- `GET /api/categories`
- `POST /api/categories` *(admin)*
- `PUT /api/categories/:id` *(admin)*
- `DELETE /api/categories/:id` *(admin)*

**Ouvrages**
- `GET /api/ouvrages`
- `GET /api/ouvrages/:id`
- `POST /api/ouvrages` *(admin)*
- `PUT /api/ouvrages/:id` *(admin)*
- `DELETE /api/ouvrages/:id` *(admin)*

---

## 9. Sécurité

- Mots de passe hashés avec bcrypt côté backend
- JWT signé, stocké côté client, automatiquement attaché aux requêtes
- Routes admin protégées côté frontend (`ProtectedRoute`) **et** côté backend (`verifyToken` + `authorizeRoles`)
- Validation des entrées formulaires côté frontend

---
10. Design & UX

Le frontend adopte une esthétique de librairie haut de gamme :

palette ivoire / encre / or / bourgogne

typographie Cormorant Garamond (titres) + Inter (texte)

glassmorphism, micro-animations Framer Motion, hover effects

design entièrement responsive (mobile-first)

navbar transparente qui se condense au scroll, panier animé

cartes de livres avec "couvertures" générées dynamiquement par dégradé
---

## 11. Maquettes, conception visuelle et démonstration

Dans le cadre de l’étape 3, des maquettes visuelles ont été préparées afin de représenter les principales interfaces du site livresgourmands.net.

### Maquettes Figma

Les maquettes Figma présentent les écrans principaux du site en version desktop et mobile :

- page d’accueil
- catalogue des ouvrages
- fiche détail d’un ouvrage
- panier
- page de connexion
- dashboard administrateur
- gestion des ouvrages
- versions mobiles principales

Lien Figma :  
[Ajouter le lien Figma ici]

### Prototype Adobe XD

Le prototype Adobe XD n’a pas été réalisé séparément.  
Les principales interactions sont démontrées directement à travers le front-end React fonctionnel et la vidéo de démonstration.

### Dossier de conception

Le dossier de conception de l’étape 3 est disponible dans le dossier `docs/`.

Fichier :  
`docs/dossier_conception_etape3.pdf`

Ce document présente :

- l’identité visuelle du projet
- les choix de couleurs et de typographie
- la structure des pages
- les choix UX/UI
- le responsive design
- l’intégration front-end / back-end
- les limites et améliorations possibles

### Vidéo de démonstration

Une courte vidéo de démonstration présente le fonctionnement du projet :

- lancement du back-end
- lancement du front-end
- affichage des ouvrages depuis l’API
- consultation d’une fiche produit
- ajout au panier
- gestion du panier
- connexion administrateur
- accès au dashboard
- gestion des ouvrages et catégories

Lien vidéo :  
[Ajouter le lien de la vidéo ici]

---

## 12. Tests de l'API

Les tests Postman réalisés à l'étape 2 restent disponibles dans `docs/screenshots/`.

---

## 13. Améliorations possibles

- Intégration d'un module de paiement réel (Stripe)
- Section avis lecteurs persistée en base
- Gestion des commandes (table `commandes`) côté admin
- Tests end-to-end (Cypress/Playwright)
- Internationalisation (i18n)

---

## 14. Conclusion

Ce projet en trois étapes nous a permis de mettre en pratique :
- la conception UML d'une base de données relationnelle
- le développement d'une API REST sécurisée
- la construction d'un frontend React moderne, connecté et responsive
- la gestion d'état global et la persistance côté client

Le résultat final est une plateforme complète, prête à évoluer vers une mise en production.
