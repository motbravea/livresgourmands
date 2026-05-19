import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ouvragesApi, categoriesApi } from '../../services/api';
import './AdminPages.css';

export default function AdminOverview() {
  const [stats, setStats] = useState({ books: 0, categories: 0, stock: 0, outOfStock: 0 });
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    Promise.allSettled([ouvragesApi.list(), categoriesApi.list()])
      .then(([booksRes, catsRes]) => {
        if (!mounted) return;
        const books = booksRes.status === 'fulfilled' ? booksRes.value : [];
        const cats = catsRes.status === 'fulfilled' ? catsRes.value : [];
        const stock = books.reduce((s, b) => s + (Number(b.stock) || 0), 0);
        const outOfStock = books.filter((b) => (b.stock || 0) === 0).length;
        setStats({ books: books.length, categories: cats.length, stock, outOfStock });
        setRecent(books.slice(0, 5));
        if (booksRes.status === 'rejected' && catsRes.status === 'rejected') {
          setError("Impossible de récupérer les données. Vérifiez l'API.");
        }
      })
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  const cards = [
    { label: 'Ouvrages', value: stats.books, hint: 'Au catalogue', color: 'card--ink' },
    { label: 'Catégories', value: stats.categories, hint: 'Univers culinaires', color: 'card--gold' },
    { label: 'Exemplaires', value: stats.stock, hint: 'Stock total', color: 'card--sage' },
    { label: 'Épuisés', value: stats.outOfStock, hint: 'À réapprovisionner', color: 'card--burgundy' },
  ];

  return (
    <>
      <header className="admin__page-head">
        <div>
          <span className="eyebrow">Tableau de bord</span>
          <h1>Vue d'ensemble</h1>
          <p>Pilotage rapide du catalogue Livres Gourmands.</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link to="/admin/ouvrages" className="btn btn-primary btn-sm">+ Nouvel ouvrage</Link>
          <Link to="/admin/categories" className="btn btn-ghost btn-sm">+ Catégorie</Link>
        </div>
      </header>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="stats-grid">
        {cards.map((c, i) => (
          <motion.div
            key={c.label}
            className={`stat-card ${c.color}`}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
          >
            <span className="stat-card__label">{c.label}</span>
            <span className="stat-card__value">{loading ? '…' : c.value}</span>
            <span className="stat-card__hint">{c.hint}</span>
          </motion.div>
        ))}
      </div>

      <section className="admin-card">
        <header>
          <div>
            <h3>Derniers ouvrages</h3>
            <p>Les 5 derniers ouvrages référencés.</p>
          </div>
          <Link to="/admin/ouvrages" className="btn btn-ghost btn-sm">Gérer →</Link>
        </header>
        {loading ? (
          <div className="loader-center"><span className="loader"></span></div>
        ) : recent.length === 0 ? (
          <div className="empty-state">
            <p>Aucun ouvrage pour le moment.</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr><th>Titre</th><th>Auteur</th><th>Catégorie</th><th>Stock</th><th>Prix</th></tr>
            </thead>
            <tbody>
              {recent.map((b) => (
                <tr key={b.id}>
                  <td className="t-strong">{b.titre}</td>
                  <td>{b.auteur || '—'}</td>
                  <td>{b.categorie || '—'}</td>
                  <td>
                    <span className={`pill ${(b.stock || 0) > 0 ? 'pill--success' : 'pill--danger'}`}>
                      {b.stock || 0}
                    </span>
                  </td>
                  <td>{Number(b.prix || 0).toFixed(2)} €</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </>
  );
}
