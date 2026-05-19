CREATE DATABASE IF NOT EXISTS livresgourmands;
USE livresgourmands;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(100),
  email VARCHAR(150) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('client','editeur','gestionnaire','administrateur') DEFAULT 'client',
  actif BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(100) UNIQUE NOT NULL,
  description TEXT
);

CREATE TABLE ouvrages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titre VARCHAR(150) NOT NULL,
  auteur VARCHAR(150) NOT NULL,
  isbn VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  prix DECIMAL(10,2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  categorie_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_ouvrages_categories
    FOREIGN KEY (categorie_id) REFERENCES categories(id)
);

CREATE TABLE panier (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_id INT NOT NULL,
  actif BOOLEAN DEFAULT true,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_panier_users
    FOREIGN KEY (client_id) REFERENCES users(id)
);

CREATE TABLE panier_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  panier_id INT NOT NULL,
  ouvrage_id INT NOT NULL,
  quantite INT NOT NULL,
  prix_unitaire DECIMAL(10,2) NOT NULL,
  CONSTRAINT fk_panier_items_panier
    FOREIGN KEY (panier_id) REFERENCES panier(id),
  CONSTRAINT fk_panier_items_ouvrages
    FOREIGN KEY (ouvrage_id) REFERENCES ouvrages(id)
);

CREATE TABLE commandes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_id INT NOT NULL,
  date DATETIME DEFAULT CURRENT_TIMESTAMP,
  total DECIMAL(10,2) NOT NULL,
  statut ENUM('en_cours','payee','annulee','expediee') DEFAULT 'en_cours',
  adresse_livraison TEXT,
  mode_livraison VARCHAR(100),
  mode_paiement VARCHAR(100),
  payment_provider_id VARCHAR(150),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_commandes_users
    FOREIGN KEY (client_id) REFERENCES users(id)
);

CREATE TABLE commande_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  commande_id INT NOT NULL,
  ouvrage_id INT NOT NULL,
  quantite INT NOT NULL,
  prix_unitaire DECIMAL(10,2) NOT NULL,
  CONSTRAINT fk_commande_items_commandes
    FOREIGN KEY (commande_id) REFERENCES commandes(id),
  CONSTRAINT fk_commande_items_ouvrages
    FOREIGN KEY (ouvrage_id) REFERENCES ouvrages(id)
);

CREATE TABLE listes_cadeaux (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(150) NOT NULL,
  proprietaire_id INT NOT NULL,
  code_partage VARCHAR(100) UNIQUE NOT NULL,
  date_creation DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_listes_cadeaux_users
    FOREIGN KEY (proprietaire_id) REFERENCES users(id)
);

CREATE TABLE liste_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  liste_id INT NOT NULL,
  ouvrage_id INT NOT NULL,
  quantite_souhaitee INT NOT NULL,
  CONSTRAINT fk_liste_items_listes
    FOREIGN KEY (liste_id) REFERENCES listes_cadeaux(id),
  CONSTRAINT fk_liste_items_ouvrages
    FOREIGN KEY (ouvrage_id) REFERENCES ouvrages(id)
);

CREATE TABLE avis (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_id INT NOT NULL,
  ouvrage_id INT NOT NULL,
  note INT NOT NULL,
  commentaire TEXT,
  date DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_avis_users
    FOREIGN KEY (client_id) REFERENCES users(id),
  CONSTRAINT fk_avis_ouvrages
    FOREIGN KEY (ouvrage_id) REFERENCES ouvrages(id)
);

CREATE TABLE commentaires (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_id INT NOT NULL,
  ouvrage_id INT NOT NULL,
  contenu TEXT NOT NULL,
  valide BOOLEAN DEFAULT false,
  date_soumission DATETIME DEFAULT CURRENT_TIMESTAMP,
  date_validation DATETIME,
  valide_par INT,
  CONSTRAINT fk_commentaires_users
    FOREIGN KEY (client_id) REFERENCES users(id),
  CONSTRAINT fk_commentaires_ouvrages
    FOREIGN KEY (ouvrage_id) REFERENCES ouvrages(id),
  CONSTRAINT fk_commentaires_validateur
    FOREIGN KEY (valide_par) REFERENCES users(id)
);

CREATE TABLE payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  commande_id INT NOT NULL,
  provider VARCHAR(100),
  provider_payment_id VARCHAR(150),
  statut VARCHAR(100),
  amount DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_payments_commandes
    FOREIGN KEY (commande_id) REFERENCES commandes(id)
);