import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ouvragesApi, categoriesApi } from '../services/api';
import BookCard from '../components/BookCard';
import './Ouvrages.css';

export default function Ouvrages() {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [q, setQ] = useState(searchParams.get('q') || '');
  const [categoryId, setCategoryId] = useState(searchParams.get('cat') || '');
  const [availability, setAvailability] = useState('all');
  const [sort, setSort] = useState('default');

  useEffect(() => {
    let mounted = true;
    Promise.allSettled([ouvragesApi.list(), categoriesApi.list()])
      .then(([booksRes, catsRes]) => {
        if (!mounted) return;
        if (booksRes.status === 'fulfilled') setBooks(booksRes.value || []);
        else setError('Impossible de charger les ouvrages.');
        if (catsRes.status === 'fulfilled') setCategories(catsRes.value || []);
      })
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  // Sync URL with state
  useEffect(() => {
    const next = {};
    if (q) next.q = q;
    if (categoryId) next.cat = categoryId;
    setSearchParams(next, { replace: true });
  }, [q, categoryId, setSearchParams]);

  const filtered = useMemo(() => {
    let list = books;
    if (q.trim()) {
      const needle = q.trim().toLowerCase();
      list = list.filter(
        (b) =>
          (b.titre || '').toLowerCase().includes(needle) ||
          (b.auteur || '').toLowerCase().includes(needle)
      );
    }
    if (categoryId) {
      list = list.filter((b) => String(b.categorie_id) === String(categoryId));
    }
    if (availability === 'in') list = list.filter((b) => (b.stock || 0) > 0);
    if (availability === 'out') list = list.filter((b) => (b.stock || 0) === 0);

    if (sort === 'price-asc') list = [...list].sort((a, b) => a.prix - b.prix);
    else if (sort === 'price-desc') list = [...list].sort((a, b) => b.prix - a.prix);
    else if (sort === 'title') list = [...list].sort((a, b) => (a.titre || '').localeCompare(b.titre || ''));
    return list;
  }, [books, q, categoryId, availability, sort]);

  return (
    <div className="page ouvrages">
      <div className="container">
        <header className="ouvrages__header">
          <span className="eyebrow">Notre catalogue</span>
          <h1>Tous les ouvrages</h1>
          <p>Parcourez l'intégralité de notre collection — recherchez, filtrez, triez.</p>
        </header>

        <div className="ouvrages__toolbar">
          <div className="ouvrages__search">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
            </svg>
            <input
              type="search"
              placeholder="Titre ou auteur…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            {q && (
              <button className="ouvrages__clear" onClick={() => setQ('')} aria-label="Effacer">×</button>
            )}
          </div>

          <div className="ouvrages__filters">
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
              <option value="">Toutes catégories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.nom}</option>
              ))}
            </select>

            <select value={availability} onChange={(e) => setAvailability(e.target.value)}>
              <option value="all">Toute disponibilité</option>
              <option value="in">En stock</option>
              <option value="out">Épuisé</option>
            </select>

            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="default">Tri par défaut</option>
              <option value="title">Titre (A-Z)</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
            </select>
          </div>
        </div>

        <div className="ouvrages__count">
          {loading ? '…' : `${filtered.length} ouvrage${filtered.length > 1 ? 's' : ''}`}
        </div>

        {loading && <div className="loader-center"><span className="loader"></span></div>}
        {error && <div className="alert alert-error">{error}</div>}

        {!loading && !error && filtered.length === 0 && (
          <div className="empty-state">
            <h3>Aucun résultat</h3>
            <p>Modifiez vos critères pour explorer notre catalogue.</p>
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div className="books-grid">
            {filtered.map((b, i) => <BookCard key={b.id} book={b} index={i} />)}
          </div>
        )}
      </div>
    </div>
  );
}
