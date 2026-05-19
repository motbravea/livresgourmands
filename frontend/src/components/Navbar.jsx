import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Logo from './Logo';
import './Navbar.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/');
  };

  return (
    <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="container navbar__inner">
        <Link to="/" className="navbar__brand" onClick={() => setMenuOpen(false)}>
          <Logo size={scrolled ? 38 : 42} />
        </Link>

        <nav className={`navbar__nav ${menuOpen ? 'is-open' : ''}`}>
          <NavLink to="/" end onClick={() => setMenuOpen(false)}>Accueil</NavLink>
          <NavLink to="/ouvrages" onClick={() => setMenuOpen(false)}>Ouvrages</NavLink>
          <NavLink to="/categories" onClick={() => setMenuOpen(false)}>Catégories</NavLink>
          {isAdmin && (
            <NavLink to="/admin" onClick={() => setMenuOpen(false)} className="navbar__admin">
              Dashboard
            </NavLink>
          )}
        </nav>

        <div className="navbar__actions">
          <Link to="/panier" className="navbar__cart" aria-label="Panier">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
              <path d="M3 6h18"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            <AnimatePresence>
              {count > 0 && (
                <motion.span
                  key={count}
                  className="navbar__cart-badge"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                >
                  {count}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>

          {isAuthenticated ? (
            <div className="navbar__user">
              <span className="navbar__user-chip">
                {(user?.email || 'Compte').slice(0, 1).toUpperCase()}
              </span>
              <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
                Déconnexion
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="navbar__link-quiet">Connexion</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Créer un compte</Link>
            </>
          )}

          <button
            className={`navbar__burger ${menuOpen ? 'is-open' : ''}`}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menu"
          >
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </header>
  );
}
