import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { categoriesApi } from '../../services/api';
import './AdminPages.css';

const blankForm = { nom: '', description: '' };

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(blankForm);
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await categoriesApi.list();
      setCategories(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(blankForm);
    setDrawerOpen(true);
  };
  const openEdit = (c) => {
    setEditingId(c.id);
    setForm({ nom: c.nom || '', description: c.description || '' });
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
      if (editingId) {
        await categoriesApi.update(editingId, form);
        setNotice('Catégorie mise à jour.');
      } else {
        await categoriesApi.create(form);
        setNotice('Catégorie créée.');
      }
      setDrawerOpen(false);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (c) => {
    if (!window.confirm(`Supprimer la catégorie "${c.nom}" ?`)) return;
    setError(null);
    try {
      await categoriesApi.remove(c.id);
      setNotice('Catégorie supprimée.');
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <header className="admin__page-head">
        <div>
          <span className="eyebrow">Univers</span>
          <h1>Catégories</h1>
          <p>Organisez les ouvrages par univers culinaires.</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>+ Ajouter une catégorie</button>
      </header>

      {error && <div className="alert alert-error">{error}</div>}
      {notice && <div className="alert alert-success">{notice}</div>}

      <section className="admin-card admin-card--flush">
        {loading ? (
          <div className="loader-center"><span className="loader"></span></div>
        ) : categories.length === 0 ? (
          <div className="empty-state">
            <h3>Aucune catégorie</h3>
            <p>Créez une première catégorie pour organiser votre catalogue.</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr><th>Nom</th><th>Description</th><th></th></tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id}>
                  <td className="t-strong">{c.nom}</td>
                  <td className="t-mute">{c.description || '—'}</td>
                  <td className="row-actions">
                    <button className="btn btn-ghost btn-sm" onClick={() => openEdit(c)}>Modifier</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(c)}>Supprimer</button>
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
                <h3>{editingId ? 'Modifier la catégorie' : 'Nouvelle catégorie'}</h3>
                <button className="drawer__close" onClick={() => setDrawerOpen(false)}>×</button>
              </header>
              <form onSubmit={handleSubmit} className="drawer__body">
                <div className="field">
                  <label>Nom *</label>
                  <input name="nom" required value={form.nom} onChange={handleChange} />
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
