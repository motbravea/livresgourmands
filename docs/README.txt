# Documentation du projet

## Présentation

Ce dossier contient l’ensemble des éléments de documentation du projet **livresgourmands.net**.  
Il permet de comprendre le fonctionnement de l’API, de valider les tests réalisés et de démontrer la conformité du projet avec les exigences du travail.

---

## Contenu du dossier

### 1. Screenshots (`screenshots/`)

Ce dossier contient les captures d’écran des tests effectués avec Postman.

Ces captures démontrent :

- l’inscription d’un utilisateur (register)
- la connexion avec génération de token JWT (login)
- l’accès aux routes protégées
- la gestion des rôles (administrateur vs utilisateur)
- les opérations CRUD sur les catégories
- les opérations CRUD sur les ouvrages

Ces éléments servent de preuve du bon fonctionnement de l’API.

---

### 2. Dictionnaire des données (`data_dictionary.md`)

Ce document décrit la structure de la base de données.

Il contient :

- la liste des tables
- les colonnes de chaque table
- les types de données
- les clés primaires
- les clés étrangères
- les relations entre les entités

Ce fichier permet de comprendre l’organisation des données et les contraintes appliquées.

---

### 3. Rapport du projet (`Rapport.docx` ou `rapport.pdf`)

Ce document présente une analyse globale du projet.

Il inclut :

- la description du système
- les objectifs du projet
- les technologies utilisées (Node.js, Express, MySQL)
- la structure de l’API
- la gestion de l’authentification (JWT)
- la sécurisation des mots de passe (bcrypt)
- les règles de gestion implémentées
- les limites du projet
- les améliorations possibles

---

## Objectif de la documentation

Cette documentation a pour but de :

- faciliter la compréhension du projet
- démontrer le bon fonctionnement de l’API
- fournir une vision claire de la base de données
- présenter les choix techniques effectués
- répondre aux exigences académiques du travail

Elle complète l’implémentation backend et constitue une preuve du travail réalisé.

---

## Conclusion

Le dossier `docs/` regroupe tous les éléments nécessaires pour analyser, tester et valider le projet.  
Il joue un rôle essentiel dans la présentation finale et dans l’évaluation du travail.
