import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ouvragesApi, categoriesApi } from '../../services/api';
import './AdminPages.css';

const blankForm = {
  titre: '',
  auteur: '',
  isbn: '',
  description: '',
  prix: '',
  stock: '',
  categorie_id: '',
};

export default function AdminOuvrages() {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);
  const [search, setSearch] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(blankForm);
  const [submitting, setSubmitting] = useState(false);

  const loadAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const [b, c] = await Promise.all([ouvragesApi.list(), categoriesApi.list()]);
      setBooks(b || []);
      setCategories(c || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAll(); }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return books;
    const n = search.trim().toLowerCase();
    return books.filter(
      (b) =>
        (b.titre || '').toLowerCase().includes(n) ||
        (b.auteur || '').toLowerCase().includes(n) ||
        (b.isbn || '').toLowerCase().includes(n)
    );
  }, [books, search]);

  const openCreate = () => {
    setEditingId(null);
    setForm(blankForm);
    setDrawerOpen(true);
  };

  const openEdit = (b) => {
    setEditingId(b.id);
    setForm({
      titre: b.titre || '',
      auteur: b.auteur || '',
      isbn: b.isbn || '',
      description: b.description || '',
      prix: b.prix ?? '',
      stock: b.stock ?? '',
      categorie_id: b.categorie_id ?? '',
    });
    setDrawerOpen(true);
  };

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setNotice(null);
    try {
      const payload = {
        ...form,
        prix: Number(form.prix) || 0,
        stock: parseInt(form.stock, 10) || 0,
        categorie_id: form.categorie_id || null,
      };
      if (editingId) {
        await ouvragesApi.update(editingId, payload);
        setNotice('Ouvrage mis à jour.');
      } else {
        await ouvragesApi.create(payload);
        setNotice('Ouvrage créé.');
      }
      setDrawerOpen(false);
      await loadAll();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (b) => {
    if (!window.confirm(`Supprimer définitivement "${b.titre}" ?`)) return;
    setError(null);
    try {
      await ouvragesApi.remove(b.id);
      setNotice('Ouvrage supprimé.');
      await loadAll();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <header className="admin__page-head">
        <div>
          <span className="eyebrow">Catalogue</span>
          <h1>Ouvrages</h1>
          <p>Gérer, créer, modifier et supprimer les ouvrages.</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>+ Ajouter un ouvrage</button>
      </header>

      {error && <div className="alert alert-error">{error}</div>}
      {notice && <div className="alert alert-success">{notice}</div>}

      <div className="admin-toolbar">
        <input
          type="search"
          placeholder="Rechercher par titre, auteur ou ISBN…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span className="admin-toolbar__count">
          {filtered.length} ouvrage{filtered.length > 1 ? 's' : ''}
        </span>
      </div>

      <section className="admin-card admin-card--flush">
        {loading ? (
          <div className="loader-center"><span className="loader"></span></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <h3>Aucun ouvrage</h3>
            <p>Commencez par ajouter un premier ouvrage à votre catalogue.</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Titre</th>
                <th>Auteur</th>
                <th>Catégorie</th>
                <th>Stock</th>
                <th>Prix</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <tr key={b.id}>
                  <td>
                    <div className="t-strong">{b.titre}</div>
                    {b.isbn && <div className="t-mute">ISBN {b.isbn}</div>}
                  </td>
                  <td>{b.auteur || '—'}</td>
                  <td>{b.categorie || '—'}</td>
                  <td>
                    <span className={`pill ${(b.stock || 0) > 0 ? 'pill--success' : 'pill--danger'}`}>
                      {b.stock || 0}
                    </span>
                  </td>
                  <td className="t-strong">{Number(b.prix || 0).toFixed(2)} €</td>
                  <td className="row-actions">
                    <button className="btn btn-ghost btn-sm" onClick={() => openEdit(b)}>Modifier</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(b)}>Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              className="drawer-backdrop"
              onClick={() => setDrawerOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.aside
              className="drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <header className="drawer__head">
                <h3>{editingId ? "Modifier l'ouvrage" : 'Nouvel ouvrage'}</h3>
                <button className="drawer__close" onClick={() => setDrawerOpen(false)} aria-label="Fermer">×</button>
              </header>
              <form onSubmit={handleSubmit} className="drawer__body">
                <div className="field">
                  <label>Titre *</label>
                  <input name="titre" required value={form.titre} onChange={handleChange} />
                </div>
                <div className="field">
                  <label>Auteur</label>
                  <input name="auteur" value={form.auteur} onChange={handleChange} />
                </div>
                <div className="field">
                  <label>ISBN</label>
                  <input name="isbn" value={form.isbn} onChange={handleChange} />
                </div>
                <div className="grid-2">
                  <div className="field">
                    <label>Prix (€)</label>
                    <input name="prix" type="number" step="0.01" min="0" value={form.prix} onChange={handleChange} />
                  </div>
                  <div className="field">
                    <label>Stock</label>
                    <input name="stock" type="number" min="0" value={form.stock} onChange={handleChange} />
                  </div>
                </div>
                <div className="field">
                  <label>Catégorie</label>
                  <select name="categorie_id" value={form.categorie_id} onChange={handleChange}>
                    <option value="">— Sans catégorie —</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.nom}</option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label>Description</label>
                  <textarea name="description" value={form.description} onChange={handleChange} />
                </div>
                <div className="drawer__actions">
                  <button type="button" className="btn btn-ghost" onClick={() => setDrawerOpen(false)}>Annuler</button>
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? 'Enregistrement…' : editingId ? 'Mettre à jour' : 'Créer'}
                  </button>
                </div>
              </form>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
