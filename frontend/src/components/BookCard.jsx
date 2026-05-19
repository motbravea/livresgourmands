import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import './BookCard.css';

// Generates a deterministic gradient per book — so books look distinct without images.
// Palette: forest green, gold, burgundy, deep moss — to match the logo identity.
function gradientFor(id = 0) {
  const palettes = [
    ['#133024', '#1f4d3a'],
    ['#1f4d3a', '#c9a961'],
    ['#1c4634', '#6b1f2a'],
    ['#3b7a5d', '#1f4d3a'],
    ['#133024', '#a8893f'],
    ['#1f4d3a', '#3b7a5d'],
    ['#2b6149', '#c9a961'],
    ['#133024', '#6b1f2a'],
  ];
  const [a, b] = palettes[id % palettes.length];
  return `linear-gradient(135deg, ${a} 0%, ${b} 100%)`;
}

export default function BookCard({ book, index = 0 }) {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const initials = (book.titre || '?')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  const inStock = (book.stock ?? 0) > 0;

  const onAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (inStock) addToCart(book);
  };
  const onView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/ouvrages/${book.id}`);
  };

  return (
    <motion.article
      className="book-card"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link to={`/ouvrages/${book.id}`} className="book-card__link">
        <div className="book-card__cover" style={{ background: gradientFor(book.id) }}>
          <div className="book-card__cover-shine"></div>
          <div className="book-card__cover-spine"></div>
          <div className="book-card__cover-inner">
            <span className="book-card__cover-mark">{initials}</span>
            <span className="book-card__cover-title">{book.titre}</span>
            {book.auteur && <span className="book-card__cover-author">— {book.auteur}</span>}
          </div>
          {book.categorie && (
            <span className="book-card__chip">{book.categorie}</span>
          )}
          <span className={`book-card__avail ${inStock ? 'in' : 'out'}`}>
            <span className="dot" /> {inStock ? 'Disponible' : 'Épuisé'}
          </span>
        </div>

        <div className="book-card__body">
          <h3 className="book-card__title">{book.titre}</h3>
          {book.auteur && <span className="book-card__author">par {book.auteur}</span>}

          <div className="book-card__meta-row">
            <span className="book-card__price">
              {Number(book.prix || 0).toFixed(2)} <span>€</span>
            </span>
            <span className={`book-card__stock ${inStock ? 'in' : 'out'}`}>
              {inStock ? `Stock · ${book.stock}` : 'Indisponible'}
            </span>
          </div>

          <div className="book-card__actions">
            <button
              type="button"
              className="book-card__btn book-card__btn--ghost"
              onClick={onView}
              aria-label="Voir le détail"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
              </svg>
              Voir
            </button>
            <button
              type="button"
              className="book-card__btn book-card__btn--add"
              onClick={onAdd}
              disabled={!inStock}
              aria-label="Ajouter au panier"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12h14"/>
              </svg>
              Panier
            </button>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
