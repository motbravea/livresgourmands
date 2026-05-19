import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ouvragesApi, categoriesApi } from '../services/api';
import { useCart } from '../context/CartContext';
import BookCard from '../components/BookCard';
import './ProductDetails.css';

const palettes = [
  ['#133024', '#1f4d3a'],
  ['#1f4d3a', '#c9a961'],
  ['#1c4634', '#6b1f2a'],
  ['#2b6149', '#1f4d3a'],
];

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [book, setBook] = useState(null);
  const [related, setRelated] = useState([]);
  const [categoryName, setCategoryName] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    setAdded(false);

    Promise.allSettled([
      ouvragesApi.get(id),
      ouvragesApi.list(),
      categoriesApi.list(),
    ])
      .then(([bookRes, listRes, catsRes]) => {
        if (!mounted) return;
        if (bookRes.status === 'fulfilled') {
          setBook(bookRes.value);
          if (catsRes.status === 'fulfilled' && bookRes.value?.categorie_id) {
            const cat = catsRes.value.find(
              (c) => String(c.id) === String(bookRes.value.categorie_id)
            );
            if (cat) setCategoryName(cat.nom);
          }
          if (listRes.status === 'fulfilled') {
            const others = listRes.value
              .filter((b) => b.id !== bookRes.value.id)
              .filter(
                (b) =>
                  !bookRes.value.categorie_id ||
                  b.categorie_id === bookRes.value.categorie_id
              )
              .slice(0, 4);
            setRelated(others.length ? others : listRes.value.slice(0, 4));
          }
        } else {
          setError('Ouvrage introuvable.');
        }
      })
      .finally(() => mounted && setLoading(false));

    return () => { mounted = false; };
  }, [id]);

  const inStock = (book?.stock || 0) > 0;
  const palette = palettes[(Number(id) || 0) % palettes.length];

  const handleAdd = () => {
    if (!book || !inStock) return;
    addToCart(book, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  };

  if (loading) {
    return (
      <div className="page">
        <div className="loader-center"><span className="loader"></span></div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="page-narrow">
        <div className="alert alert-error">{error || "Ouvrage introuvable."}</div>
        <button className="btn btn-ghost" onClick={() => navigate(-1)}>← Retour</button>
      </div>
    );
  }

  return (
    <div className="page product">
      <div className="container">
        <nav className="product__breadcrumb">
          <Link to="/">Accueil</Link> <span>/</span>
          <Link to="/ouvrages">Ouvrages</Link> <span>/</span>
          <span className="product__breadcrumb-current">{book.titre}</span>
        </nav>

        <div className="product__grid">
          <motion.div
            className="product__visual"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div
              className="product__cover"
              style={{ background: `linear-gradient(135deg, ${palette[0]} 0%, ${palette[1]} 100%)` }}
            >
              <div className="product__cover-shine"></div>
              <div className="product__cover-spine"></div>
              <div className="product__cover-inner">
                <span className="product__cover-mark">
                  {book.titre?.slice(0, 1).toUpperCase()}
                </span>
                <span className="product__cover-title">{book.titre}</span>
                {book.auteur && <span className="product__cover-author">— {book.auteur}</span>}
              </div>
            </div>
          </motion.div>

          <motion.div
            className="product__info"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            {categoryName && (
              <Link to={`/ouvrages?cat=${book.categorie_id}`} className="product__cat-chip">
                {categoryName}
              </Link>
            )}
            <h1 className="product__title">{book.titre}</h1>
            {book.auteur && <p className="product__author">par <em>{book.auteur}</em></p>}

            <div className="product__price-line">
              <span className="product__price">{Number(book.prix || 0).toFixed(2)} €</span>
              <span className={`product__stock-pill ${inStock ? 'in' : 'out'}`}>
                {inStock ? `En stock — ${book.stock} exemplaire${book.stock > 1 ? 's' : ''}` : 'Épuisé'}
              </span>
            </div>

            {book.isbn && (
              <p className="product__isbn">ISBN <code>{book.isbn}</code></p>
            )}

            <div className="product__desc">
              <h3>Description</h3>
              <p>{book.description || "Cet ouvrage rejoint très bientôt notre fiche éditoriale. Patience est mère de toute gourmandise."}</p>
            </div>

            <div className="product__buy">
              <div className="product__qty">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Diminuer">−</button>
                <input
                  type="number"
                  min="1"
                  value={qty}
                  onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
                />
                <button onClick={() => setQty((q) => q + 1)} aria-label="Augmenter">+</button>
              </div>
              <button
                className="btn btn-gold btn-lg"
                onClick={handleAdd}
                disabled={!inStock}
              >
                {added ? '✓ Ajouté au panier' : inStock ? 'Ajouter au panier' : 'Indisponible'}
              </button>
            </div>

            <div className="product__perks">
              <div><strong>Livraison soignée</strong><span>Sous emballage de prestige</span></div>
              <div><strong>Édition limitée</strong><span>Tirage numéroté</span></div>
              <div><strong>Conseil libraire</strong><span>Disponible sur rendez-vous</span></div>
            </div>
          </motion.div>
        </div>

        {/* Reviews placeholder */}
        <section className="product__reviews">
          <h2>Avis lecteurs</h2>
          <div className="product__reviews-empty card">
            <p>Soyez le premier à donner votre avis sur cet ouvrage.</p>
            <button className="btn btn-ghost btn-sm" disabled>Bientôt disponible</button>
          </div>
        </section>

        {related.length > 0 && (
          <section className="product__related">
            <h2>À découvrir également</h2>
            <div className="books-grid">
              {related.map((b, i) => <BookCard key={b.id} book={b} index={i} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
