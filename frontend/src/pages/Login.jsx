import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import './Auth.css';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || '/';

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(form);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message || 'Échec de connexion.');
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
          <span className="eyebrow auth__aside-eyebrow">Bienvenue</span>
          <h2>Retrouvez votre bibliothèque gourmande.</h2>
          <p>Accédez à vos commandes, vos sélections personnelles et nos parutions confidentielles.</p>
          <ul className="auth__list">
            <li>· Sélections d'auteur personnalisées</li>
            <li>· Tirages limités réservés</li>
            <li>· Conseil libraire dédié</li>
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
          <h1>Connexion</h1>
          <p className="auth__sub">Heureux de vous retrouver.</p>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit} noValidate>
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
                autoComplete="current-password"
                required
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
              />
            </div>
            <button className="btn btn-primary btn-lg auth__submit" type="submit" disabled={loading}>
              {loading ? 'Connexion…' : 'Se connecter'}
            </button>
          </form>

          <p className="auth__switch">
            Première visite ? <Link to="/register">Créer un compte</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
