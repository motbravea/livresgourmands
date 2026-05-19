-- =========================================================
-- Livres Gourmands — Données de démonstration (Étape 3)
-- =========================================================
-- Exécution (depuis MySQL Workbench ou la ligne de commande) :
--   USE livresgourmands;
--   SOURCE chemin/vers/sql/seed.sql;
--
-- Le script est idempotent : il utilise INSERT IGNORE et
-- s'appuie sur les contraintes UNIQUE existantes
-- (categories.nom, ouvrages.isbn) pour ne pas dupliquer.
-- =========================================================

USE livresgourmands;

-- ---------- Catégories ----------
INSERT IGNORE INTO categories (nom, description) VALUES
  ('Cuisine italienne',       'Pâtes, pizze, risottos et traditions des terroirs italiens.'),
  ('Pâtisserie',              'Desserts classiques et modernes, viennoiseries et gestes techniques.'),
  ('Cuisine marocaine',       'Tajines, couscous, pastillas et douceurs du Maghreb.'),
  ('Cuisine française',       'Recettes du patrimoine et créations contemporaines.'),
  ('Cuisine asiatique',       'Sushis, woks, currys et techniques d''Asie.'),
  ('Cuisine méditerranéenne', 'Saveurs ensoleillées de la mer Méditerranée.');

-- ---------- Ouvrages ----------
-- Les sous-requêtes (SELECT id FROM categories WHERE nom = ...)
-- évitent d'avoir à connaître les IDs auto-incrémentés.

INSERT IGNORE INTO ouvrages
  (titre, auteur, isbn, description, prix, stock, categorie_id)
VALUES
  ('Livre Pasta',
   'Chef Mario Rossi',
   '978-2-LG-0001',
   'Recettes italiennes autour des pâtes, sauces et traditions familiales.',
   29.99, 10,
   (SELECT id FROM categories WHERE nom = 'Cuisine italienne')),

  ('Secrets de la Pâtisserie',
   'Claire Martin',
   '978-2-LG-0002',
   'Guide complet pour réussir les desserts classiques et modernes.',
   34.99, 12,
   (SELECT id FROM categories WHERE nom = 'Pâtisserie')),

  ('Saveurs du Maroc',
   'Amina El Fassi',
   '978-2-LG-0003',
   'Recettes marocaines traditionnelles : tajines, couscous, soupes et pâtisseries.',
   27.50, 8,
   (SELECT id FROM categories WHERE nom = 'Cuisine marocaine')),

  ('Cuisine Française Moderne',
   'Jean Moreau',
   '978-2-LG-0004',
   'Techniques et recettes modernes inspirées de la gastronomie française.',
   39.99, 6,
   (SELECT id FROM categories WHERE nom = 'Cuisine française')),

  ('Sushi et Traditions',
   'Hiro Tanaka',
   '978-2-LG-0005',
   'Introduction aux bases du sushi et aux saveurs japonaises.',
   31.99, 9,
   (SELECT id FROM categories WHERE nom = 'Cuisine asiatique')),

  ('Desserts de Chef',
   'Élodie Bernard',
   '978-2-LG-0006',
   'Recettes de desserts élégants avec présentation professionnelle.',
   42.00, 5,
   (SELECT id FROM categories WHERE nom = 'Pâtisserie')),

  ('Cuisine Méditerranéenne',
   'Sofia Romano',
   '978-2-LG-0007',
   'Recettes simples et équilibrées inspirées du bassin méditerranéen.',
   25.99, 14,
   (SELECT id FROM categories WHERE nom = 'Cuisine méditerranéenne')),

  ('Plats Rapides Maison',
   'Marc Dupuis',
   '978-2-LG-0008',
   'Idées de repas rapides, pratiques et accessibles pour tous les jours.',
   22.99, 20,
   (SELECT id FROM categories WHERE nom = 'Cuisine française'));

-- =========================================================
-- Vérification
-- =========================================================
SELECT COUNT(*) AS nb_categories FROM categories;
SELECT COUNT(*) AS nb_ouvrages   FROM ouvrages;
