import { Link } from 'react-router-dom';
import Logo from './Logo';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <div className="footer__logo">
              <Logo size={56} variant="light" />
            </div>
            <p className="footer__tag">
              La librairie d'excellence dédiée à la haute gastronomie et aux ouvrages culinaires d'exception.
            </p>
            <div className="footer__social">
              <a href="#" aria-label="Instagram"><span>IG</span></a>
              <a href="#" aria-label="Facebook"><span>FB</span></a>
              <a href="#" aria-label="Pinterest"><span>PI</span></a>
            </div>
          </div>

          <div className="footer__col">
            <h4>Découvrir</h4>
            <ul>
              <li><Link to="/ouvrages">Tous les ouvrages</Link></li>
              <li><Link to="/categories">Catégories</Link></li>
              <li><Link to="/panier">Mon panier</Link></li>
            </ul>
          </div>

          <div className="footer__col">
            <h4>Compte</h4>
            <ul>
              <li><Link to="/login">Connexion</Link></li>
              <li><Link to="/register">Créer un compte</Link></li>
              <li><Link to="/admin">Espace pro</Link></li>
            </ul>
          </div>

          <div className="footer__col footer__newsletter">
            <h4>Lettre confidentielle</h4>
            <p>Recevez nos nouveautés et tirages limités.</p>
            <form onSubmit={(e) => e.preventDefault()} className="footer__form">
              <input type="email" placeholder="votre@email.com" />
              <button type="submit" className="btn btn-gold btn-sm">S'inscrire</button>
            </form>
          </div>
        </div>

        <div className="footer__bottom">
          <span>© {new Date().getFullYear()} Livres Gourmands — Tous droits réservés.</span>
          <span className="footer__credit">Projet Programmation Web avancée · Étape 3</span>
        </div>
      </div>
    </footer>
  );
}
