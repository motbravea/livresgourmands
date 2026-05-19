import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import './Auth.css';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ nom: '', email: '', password: '' });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (form.password.length < 6) {
      setError('Le mot de passe doit comporter au moins 6 caractères.');
      return;
    }
    setLoading(true);
    try {
      await register(form);
      setSuccess('Compte créé avec succès. Redirection vers la connexion…');
      setTimeout(() => navigate('/login'), 1300);
    } catch (err) {
      setError(err.message || "Échec de l'inscription.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth">
      <motion.div
        className="auth__panel auth__panel--aside"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="auth__aside-inner">
          <span className="eyebrow auth__aside-eyebrow">Rejoignez-nous</span>
          <h2>L'entrée dans notre maison d'édition.</h2>
          <p>Créez votre compte pour suivre vos commandes et accéder à nos tirages confidentiels.</p>
          <ul className="auth__list">
            <li>· Notifications de nouveautés</li>
            <li>· Wishlist personnelle</li>
            <li>· Accès aux ventes privées</li>
          </ul>
        </div>
      </motion.div>

      <motion.div
        className="auth__panel auth__panel--form"
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="auth__form-wrap">
          <Link to="/" className="auth__brand">
            <Logo size={46} withWordmark={true} />
          </Link>
          <h1>Créer un compte</h1>
          <p className="auth__sub">Quelques secondes suffisent.</p>

          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label htmlFor="nom">Nom complet</label>
              <input
                id="nom"
                name="nom"
                type="text"
                autoComplete="name"
                required
                placeholder="Auguste Escoffier"
                value={form.nom}
                onChange={handleChange}
              />
            </div>
            <div className="field">
              <label htmlFor="email">Adresse email</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="vous@maison.fr"
                value={form.email}
                onChange={handleChange}
              />
            </div>
            <div className="field">
              <label htmlFor="password">Mot de passe</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={6}
                placeholder="6 caractères minimum"
                value={form.password}
                onChange={handleChange}
              />
            </div>
            <button className="btn btn-gold btn-lg auth__submit" type="submit" disabled={loading}>
              {loading ? 'Création…' : 'Créer mon compte'}
            </button>
          </form>

          <p className="auth__switch">
            Vous avez déjà un compte ? <Link to="/login">Connexion</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
