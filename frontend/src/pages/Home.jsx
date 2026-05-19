import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ouvragesApi, categoriesApi } from '../services/api';
import BookCard from '../components/BookCard';
import './Home.css';

export default function Home() {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    let mounted = true;
    Promise.allSettled([ouvragesApi.list(), categoriesApi.list()])
      .then(([booksRes, catsRes]) => {
        if (!mounted) return;
        if (booksRes.status === 'fulfilled') setBooks(booksRes.value || []);
        if (catsRes.status === 'fulfilled') setCategories(catsRes.value || []);
        if (booksRes.status === 'rejected' && catsRes.status === 'rejected') {
          setError("Impossible de joindre l'API. Vérifiez que le backend tourne sur :3000.");
        }
      })
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  const featured = useMemo(() => books.slice(0, 8), [books]);
  const totalStock = books.reduce((s, b) => s + (Number(b.stock) || 0), 0);

  return (
    <div className="home">
      {/* ============ HERO ============ */}
      <section className="hero">
        <div className="hero__bg">
          <div className="hero__bg-grain"></div>
        </div>

        <div className="container hero__inner">
          <motion.div
            className="hero__content"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="eyebrow hero__eyebrow">Maison fondée en 2025 · Édition d'auteur</span>
            <h1 className="hero__title">
              La <em>haute</em> gastronomie<br />
              en <em>ouvrages</em> d'exception.
            </h1>
            <p className="hero__lead">
              Une sélection rigoureuse de livres de cuisine signés par les plus
              grandes tables du monde — éditions limitées, papier d'exception,
              recettes inédites.
            </p>

            <form
              className="hero__search"
              onSubmit={(e) => {
                e.preventDefault();
                const el = document.getElementById('featured');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
              </svg>
              <input
                type="search"
                placeholder="Rechercher un titre, un auteur…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button type="submit" className="btn btn-gold btn-sm">Explorer</button>
            </form>

            <div className="hero__cta">
              <Link to="/ouvrages" className="btn btn-primary btn-lg">Découvrir la collection</Link>
              <Link to="/categories" className="btn btn-ghost btn-lg">Catégories</Link>
            </div>

            <div className="hero__stats">
              <div><strong>{books.length || '—'}</strong><span>Ouvrages</span></div>
              <div><strong>{categories.length || '—'}</strong><span>Catégories</span></div>
              <div><strong>{totalStock || '—'}</strong><span>En stock</span></div>
            </div>
          </motion.div>

          <motion.div
            className="hero__visual"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="hero__books">
              <div className="hero__book hero__book--1">
                <span>L</span>
                <small>Le Grand Livre</small>
              </div>
              <div className="hero__book hero__book--2">
                <span>G</span>
                <small>Gastronomie</small>
              </div>
              <div className="hero__book hero__book--3">
                <span>R</span>
                <small>Reliure rare</small>
              </div>
              <div className="hero__shine"></div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ VALUE PROPS ============ */}
      <section className="valueprops">
        <div className="container">
          <div className="valueprops__grid">
            {[
              { t: 'Sélection d\'auteur', d: 'Chaque ouvrage choisi à la main par notre comité de chefs.' },
              { t: 'Tirages limités', d: 'Éditions numérotées et signées, disponibles en quantité confidentielle.' },
              { t: 'Livraison soignée', d: 'Coffrets sur-mesure, expédiés sous emballage de prestige.' },
              { t: 'Conseil personnalisé', d: 'Nos libraires vous accompagnent — sur rendez-vous.' },
            ].map((v, i) => (
              <motion.div
                key={i}
                className="valueprop"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <span className="valueprop__num">{String(i + 1).padStart(2, '0')}</span>
                <h4>{v.t}</h4>
                <p>{v.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CATEGORIES ============ */}
      {categories.length > 0 && (
        <section className="section section--alt">
          <div className="container">
            <div className="section-head">
              <span className="divider-gold"></span>
              <span className="eyebrow">L'art de la table</span>
              <h2>Nos catégories</h2>
              <p>Explorez nos univers culinaires soigneusement curatés.</p>
            </div>
            <div className="categories-strip">
              {categories.slice(0, 6).map((cat, i) => (
                <motion.div
                  key={cat.id}
                  className="cat-tile"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                >
                  <Link to={`/categories?id=${cat.id}`}>
                    <span className="cat-tile__num">0{i + 1}</span>
                    <h3>{cat.nom}</h3>
                    {cat.description && <p>{cat.description}</p>}
                    <span className="cat-tile__arrow">→</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============ FEATURED BOOKS ============ */}
      <section className="section" id="featured">
        <div className="container">
          <div className="section-head">
            <span className="divider-gold"></span>
            <span className="eyebrow">Sélection du moment</span>
            <h2>Ouvrages remarquables</h2>
            <p>Une rencontre entre grands chefs, photographes d'exception et savoir-faire éditorial.</p>
          </div>

          {loading && (
            <div className="loader-center"><span className="loader"></span></div>
          )}

          {error && <div className="alert alert-error">{error}</div>}

          {!loading && !error && featured.length === 0 && (
            <div className="empty-state">
              <h3>Catalogue en préparation</h3>
              <p>Notre librairie est encore en cours d'approvisionnement. Revenez bientôt.</p>
            </div>
          )}

          {!loading && featured.length > 0 && (
            <div className="books-grid">
              {featured.map((b, i) => (
                <BookCard key={b.id} book={b} index={i} />
              ))}
            </div>
          )}

          {!loading && books.length > 8 && (
            <div className="section__cta">
              <Link to="/ouvrages" className="btn btn-ghost btn-lg">
                Voir l'ensemble du catalogue →
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ============ EDITORIAL ============ */}
      <section className="editorial">
        <div className="container editorial__inner">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="editorial__copy"
          >
            <span className="eyebrow">L'engagement Livres Gourmands</span>
            <h2>Quand le livre devient<br />une œuvre culinaire.</h2>
            <p>
              Nous publions et distribuons depuis 2025 des ouvrages culinaires
              conçus comme des objets d'art. Reliures cousues, papier crème
              chiffon, photographies argentiques, gaufrages à chaud : chaque
              détail compte. Nos ouvrages s'inscrivent dans le temps long.
            </p>
            <Link to="/ouvrages" className="btn btn-gold">Notre collection</Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="editorial__visual"
          >
            <div className="editorial__quote glass">
              <blockquote>
                « Un livre de cuisine ne devrait jamais finir à la cuisine.
                Il devrait y commencer, puis trouver sa place dans la bibliothèque. »
              </blockquote>
              <cite>— Comité éditorial, Livres Gourmands</cite>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
