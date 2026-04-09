# Projet : livresgourmands.net

## 1. Présentation

Ce projet consiste en la conception et le développement d’une API REST pour une plateforme de vente de livres de cuisine.

L’application permet :
- l’inscription et l’authentification des utilisateurs
- la gestion des rôles (client, éditeur, gestionnaire, administrateur)
- la gestion des catégories
- la gestion des ouvrages (livres)
- la sécurisation des accès via JWT

Ce projet a été réalisé dans le cadre du cours *Programmation Web avancée*.

---

## 2. Membres de l’équipe

- Khalid Asseffar  
- Youness Bellouk  

---

## 3. Technologies utilisées

- Node.js  
- Express.js  
- MySQL  
- JWT (authentification)  
- bcrypt (sécurité des mots de passe)  
- Postman (tests API)  
- GitHub (gestion de version)

---

## 4. Structure du projet
backend/
├── src/
│ ├── config/
│ ├── routes/
│ ├── middlewares/
│ ├── services/
│ └── app.js
├── server.js
└── package.json

sql/
└── database.sql

docs/
├── screenshots/
├── data_dictionary.md
└── Rapport.docx

README.md

---

## 5. Installation et exécution

### 5.1 Cloner le projet


git clone <URL_DU_REPO>
cd livresgourmands

5.2 Installer les dépendances
cd backend
npm install

5.3 Configuration de la base de données
Ouvrir MySQL Workbench
Exécuter le script :
SOURCE sql/database.sql;
Vérifier que la base de données livresgourmands est créée


5.4 Lancer le serveur
node server.js

Le serveur sera accessible sur :

http://localhost:3000

6. Fonctionnalités principales
Authentification
Inscription utilisateur
Connexion avec génération de token JWT
Sécurité
Protection des routes via middleware
Gestion des rôles (admin, client, etc.)
API
CRUD des catégories
CRUD des ouvrages
Accès sécurisé aux routes
7. Tests de l’API

Les tests ont été réalisés avec Postman.

Les captures d’écran sont disponibles dans :

docs/screenshots/

Elles démontrent :

le fonctionnement de l’authentification
l’accès aux routes protégées
la gestion des rôles
les opérations CRUD

8. Base de données

Le schéma de la base de données est disponible dans :

sql/database.sql

Il contient :

la création de toutes les tables
les relations (clés étrangères)
les contraintes

9. Documentation

Le dossier docs/ contient :

screenshots/ : preuves des tests Postman
data_dictionary.md : description des tables et colonnes
Rapport.docx : rapport du projet

10. Sécurité
Les mots de passe sont hashés avec bcrypt
Les accès sont sécurisés avec JWT
Les routes sensibles sont protégées par middleware

11. Améliorations possibles
Ajout de validation des données
Gestion complète des commandes
Ajout d’un frontend
Amélioration des performances et sécurité

12. Conclusion

Ce projet nous a permis de mettre en pratique :

la conception d’une base de données relationnelle
le développement d’une API REST
la gestion de la sécurité avec JWT
l’organisation d’un projet backend structuré

Il constitue une base solide pour une application web complète.
