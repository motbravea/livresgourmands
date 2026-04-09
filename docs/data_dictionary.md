# 📘 Dictionnaire des données – livresgourmands

## Table: users
| Colonne | Type | Description |
|--------|------|------------|
| id | INT | Identifiant utilisateur (PK) |
| nom | VARCHAR(100) | Nom de l'utilisateur |
| email | VARCHAR(150) | Email unique |
| password_hash | VARCHAR(255) | Mot de passe hashé |
| role | ENUM | Rôle (client, editeur, gestionnaire, administrateur) |
| actif | BOOLEAN | Statut actif |
| created_at | TIMESTAMP | Date création |
| updated_at | TIMESTAMP | Date modification |

---

## Table: categories
| Colonne | Type | Description |
|--------|------|------------|
| id | INT | Identifiant catégorie |
| nom | VARCHAR(100) | Nom catégorie |
| description | TEXT | Description |

---

## Table: ouvrages
| Colonne | Type | Description |
|--------|------|------------|
| id | INT | Identifiant ouvrage |
| titre | VARCHAR(150) | Titre du livre |
| auteur | VARCHAR(150) | Auteur |
| isbn | VARCHAR(50) | ISBN unique |
| description | TEXT | Description |
| prix | DECIMAL | Prix |
| stock | INT | Stock disponible |
| categorie_id | INT | Référence catégorie |

---

## Table: panier
| Colonne | Type | Description |
|--------|------|------------|
| id | INT | Identifiant panier |
| client_id | INT | Utilisateur propriétaire |
| actif | BOOLEAN | Panier actif |

---

## Table: panier_items
| Colonne | Type | Description |
|--------|------|------------|
| id | INT | Identifiant |
| panier_id | INT | Référence panier |
| ouvrage_id | INT | Référence ouvrage |
| quantite | INT | Quantité |
| prix_unitaire | DECIMAL | Prix au moment d'ajout |

---

## Table: commandes
| Colonne | Type | Description |
|--------|------|------------|
| id | INT | Identifiant commande |
| client_id | INT | Utilisateur |
| date | DATETIME | Date commande |
| total | DECIMAL | Montant total |
| statut | ENUM | Statut |
| adresse_livraison | TEXT | Adresse |
| mode_livraison | VARCHAR | Livraison |
| mode_paiement | VARCHAR | Paiement |

---

## Table: commande_items
| Colonne | Type | Description |
|--------|------|------------|
| id | INT | Identifiant |
| commande_id | INT | Référence commande |
| ouvrage_id | INT | Référence ouvrage |
| quantite | INT | Quantité |
| prix_unitaire | DECIMAL | Prix |

---

## Table: listes_cadeaux
| Colonne | Type | Description |
|--------|------|------------|
| id | INT | Identifiant |
| nom | VARCHAR | Nom liste |
| proprietaire_id | INT | Propriétaire |
| code_partage | VARCHAR | Code partage |

---

## Table: liste_items
| Colonne | Type | Description |
|--------|------|------------|
| id | INT | Identifiant |
| liste_id | INT | Référence liste |
| ouvrage_id | INT | Référence ouvrage |
| quantite_souhaitee | INT | Quantité |

---

## Table: avis
| Colonne | Type | Description |
|--------|------|------------|
| id | INT | Identifiant |
| client_id | INT | Utilisateur |
| ouvrage_id | INT | Livre |
| note | INT | Note (1-5) |
| commentaire | TEXT | Avis |

---

## Table: commentaires
| Colonne | Type | Description |
|--------|------|------------|
| id | INT | Identifiant |
| client_id | INT | Utilisateur |
| ouvrage_id | INT | Livre |
| contenu | TEXT | Contenu |
| valide | BOOLEAN | Validation |

---

## Table: payments
| Colonne | Type | Description |
|--------|------|------------|
| id | INT | Identifiant |
| commande_id | INT | Référence commande |
| provider | VARCHAR | Fournisseur |
| statut | VARCHAR | Statut |
| amount | DECIMAL | Montant |