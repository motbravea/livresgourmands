import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { categoriesApi, ouvragesApi } from '../services/api';
import BookCard from '../components/BookCard';
import './Categories.css';

const tilePalettes = [
  ['#133024', '#1f4d3a'],
  ['#1f4d3a', '#c9a961'],
  ['#1c4634', '#6b1f2a'],
  ['#2b6149', '#1f4d3a'],
  ['#133024', '#a8893f'],
  ['#3b7a5d', '#c9a961'],
];

export default function Categories() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const selectedId = searchParams.get('id');

  useEffect(() => {
    let mounted = true;
    Promise.allSettled([categoriesApi.list(), ouvragesApi.list()])
      .then(([catsRes, booksRes]) => {
        if (!mounted) return;
        if (catsRes.status === 'fulfilled') setCategories(catsRes.value || []);
        else setError('Impossible de charger les catégories.');
        if (booksRes.status === 'fulfilled') setBooks(booksRes.value || []);
      })
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  const selected = useMemo(
    () => categories.find((c) => String(c.id) === String(selectedId)),
    [categories, selectedId]
  );

  const booksInCat = useMemo(
    () => books.filter((b) => String(b.categorie_id) === String(selectedId)),
    [books, selectedId]
  );

  const countFor = (catId) =>
    books.filter((b) => String(b.categorie_id) === String(catId)).length;

  return (
    <div className="page categories">
      <div className="container">
        <header className="categories__header">
          <span className="eyebrow">Univers culinaires</span>
          <h1>Catégories</h1>
          <p>Sélectionnez un univers pour découvrir les ouvrages associés.</p>
        </header>

        {loading && <div className="loader-center"><span className="loader"></span></div>}
        {error && <div className="alert alert-error">{error}</div>}

        {!loading && !error && (
          <>
            <div className="categories__grid">
              <button
                className={`cat-card cat-card--all ${!selectedId ? 'is-active' : ''}`}
                onClick={() => setSearchParams({})}
              >
                <span className="cat-card__count">{books.length}</span>
                <h3>Tout voir</h3>
                <p>L'intégralité de la collection.</p>
              </button>

              {categories.map((c, i) => {
                const palette = tilePalettes[i % tilePalettes.length];
                const isActive = String(c.id) === String(selectedId);
                return (
                  <motion.button
                    key={c.id}
                    className={`cat-card ${isActive ? 'is-active' : ''}`}
                    style={{ background: `linear-gradient(135deg, ${palette[0]} 0%, ${palette[1]} 100%)` }}
                    onClick={() => setSearchParams({ id: String(c.id) })}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.05 }}
                  >
                    <span className="cat-card__count">{countFor(c.id)}</span>
                    <h3>{c.nom}</h3>
                    {c.description && <p>{c.description}</p>}
                  </motion.button>
                );
              })}
            </div>

            {selected ? (
              <section className="categories__results">
                <div className="categories__results-head">
                  <div>
                    <span className="eyebrow">Sélection</span>
                    <h2>{selected.nom}</h2>
                    {selected.description && <p>{selected.description}</p>}
                  </div>
                  <Link to={`/ouvrages?cat=${selected.id}`} className="btn btn-ghost btn-sm">
                    Voir dans le catalogue →
                  </Link>
                </div>

                {booksInCat.length === 0 ? (
                  <div className="empty-state">
                    <h3>Catégorie en cours de garnissage</h3>
                    <p>Aucun ouvrage pour le moment dans cet univers.</p>
                  </div>
                ) : (
                  <div className="books-grid">
                    {booksInCat.map((b, i) => <BookCard key={b.id} book={b} index={i} />)}
                  </div>
                )}
              </section>
            ) : (
              categories.length === 0 && (
                <div className="empty-state">
                  <h3>Catégories à venir</h3>
                  <p>Nos univers se précisent. Revenez très bientôt.</p>
                </div>
              )
            )}
          </>
        )}
      </div>
    </div>
  );
}
