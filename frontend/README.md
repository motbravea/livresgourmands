# Livres Gourmands — Frontend

Frontend React du projet **livresgourmands.net** (Étape 3 — Programmation Web avancée).

## Démarrage

```bash
npm install
npm run dev
```

Frontend : http://localhost:5173
Backend (doit être lancé en parallèle) : http://localhost:3000

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Démarre Vite en mode développement |
| `npm run build` | Build de production dans `dist/` |
| `npm run preview` | Sert le build de production en local |
| `npm run lint` | Vérifie le code avec ESLint |

## Stack

- **React 19** + **Vite**
- **React Router DOM v7** (routing)
- **Axios** (communication API + intercepteur JWT)
- **Context API** (`AuthContext`, `CartContext`)
- **localStorage** (persistance panier `lg_cart`, token `lg_token`, user `lg_user`)
- **Framer Motion** (animations)
- **Design system CSS sur-mesure** (palette ivoire/or/bourgogne, typographie Cormorant Garamond + Inter)

## Structure

```
src/
├── assets/
├── components/
│   ├── Navbar.jsx / .css
│   ├── Footer.jsx / .css
│   ├── BookCard.jsx / .css
│   └── ProtectedRoute.jsx
├── context/
│   ├── AuthContext.jsx
│   └── CartContext.jsx
├── layouts/
│   ├── MainLayout.jsx
│   └── AdminLayout.jsx / .css
├── pages/
│   ├── Home.jsx / .css
│   ├── Ouvrages.jsx / .css
│   ├── ProductDetails.jsx / .css
│   ├── Cart.jsx / .css
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Auth.css
│   ├── Categories.jsx / .css
│   ├── NotFound.jsx
│   └── admin/
│       ├── AdminOverview.jsx
│       ├── AdminOuvrages.jsx
│       ├── AdminCategories.jsx
│       └── AdminPages.css
├── services/
│   └── api.js
├── App.jsx
├── main.jsx
└── index.css
```

## Routes

| Route | Layout | Accès |
|-------|--------|-------|
| `/` | Main | Public |
| `/ouvrages` | Main | Public |
| `/ouvrages/:id` | Main | Public |
| `/panier` | Main | Public |
| `/categories` | Main | Public |
| `/login` | — | Public |
| `/register` | — | Public |
| `/admin` | Admin | **Protégé (rôle admin/gestionnaire/editeur)** |
| `/admin/ouvrages` | Admin | Protégé |
| `/admin/categories` | Admin | Protégé |

## Intégration backend

`src/services/api.js` configure une instance Axios pointant vers `http://localhost:3000/api`. Un intercepteur de requête attache automatiquement le header `Authorization: Bearer <token>` lorsqu'un JWT est présent dans `localStorage`. Un intercepteur de réponse normalise les erreurs pour un affichage homogène.

Helpers exposés :

```js
import { authApi, ouvragesApi, categoriesApi } from './services/api';

await authApi.login({ email, password });
await ouvragesApi.list();
await ouvragesApi.update(id, payload);
```

## Premières étapes pour tester

1. Démarrer le backend (`cd backend && node server.js`)
2. Démarrer le frontend (`npm run dev`)
3. Créer un compte sur `/register`
4. Pour tester l'admin : assigner le rôle `administrateur` à l'utilisateur en base puis se reconnecter
5. Ajouter des ouvrages depuis `/admin/ouvrages` — ils apparaissent immédiatement sur la page d'accueil et le catalogue
