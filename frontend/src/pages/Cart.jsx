import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import './Cart.css';

export default function Cart() {
  const { items, updateQuantity, removeFromCart, clearCart, total, count } = useCart();
  const shipping = items.length ? 9.5 : 0;
  const grandTotal = total + shipping;

  if (items.length === 0) {
    return (
      <div className="page-narrow">
        <div className="cart-empty">
          <div className="cart-empty__icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
              <path d="M3 6h18"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
          </div>
          <span className="eyebrow">Votre panier</span>
          <h1>Aucun ouvrage dans votre panier</h1>
          <p>Laissez-vous tenter par nos sélections d'auteurs.</p>
          <Link to="/ouvrages" className="btn btn-gold btn-lg">Découvrir la collection</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page cart">
      <div className="container">
        <header className="cart__header">
          <span className="eyebrow">Validation</span>
          <h1>Votre panier</h1>
          <p>{count} article{count > 1 ? 's' : ''} prêt{count > 1 ? 's' : ''} à rejoindre votre bibliothèque.</p>
        </header>

        <div className="cart__grid">
          <div className="cart__items">
            <AnimatePresence initial={false}>
              {items.map((item, i) => (
                <motion.article
                  key={item.id}
                  className="cart-item"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.35, delay: i * 0.03 }}
                  layout
                >
                  <div className="cart-item__cover">
                    <span>{(item.titre || '?').slice(0, 1).toUpperCase()}</span>
                  </div>
                  <div className="cart-item__info">
                    <Link to={`/ouvrages/${item.id}`} className="cart-item__title">{item.titre}</Link>
                    {item.auteur && <span className="cart-item__author">{item.auteur}</span>}
                    <span className="cart-item__unit">
                      {item.prix.toFixed(2)} € l'unité
                    </span>
                  </div>
                  <div className="cart-item__qty">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} aria-label="−">−</button>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                    />
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} aria-label="+">+</button>
                  </div>
                  <div className="cart-item__sum">
                    {(item.prix * item.quantity).toFixed(2)} €
                  </div>
                  <button className="cart-item__remove" onClick={() => removeFromCart(item.id)} aria-label="Retirer">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18"/>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
                      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                  </button>
                </motion.article>
              ))}
            </AnimatePresence>

            <div className="cart__actions">
              <Link to="/ouvrages" className="btn btn-ghost">← Continuer mes emplettes</Link>
              <button className="btn btn-danger btn-sm" onClick={clearCart}>Vider le panier</button>
            </div>
          </div>

          <aside className="cart__summary card">
            <h3>Récapitulatif</h3>
            <div className="cart__line">
              <span>Sous-total</span><strong>{total.toFixed(2)} €</strong>
            </div>
            <div className="cart__line">
              <span>Livraison</span><strong>{shipping.toFixed(2)} €</strong>
            </div>
            <div className="cart__line cart__line--total">
              <span>Total</span><strong>{grandTotal.toFixed(2)} €</strong>
            </div>
            <p className="cart__note">
              Paiement sécurisé. Emballage de prestige inclus.
            </p>
            <button className="btn btn-gold btn-lg cart__checkout" disabled>
              Passer commande
            </button>
            <p className="cart__hint">Le module de paiement sera intégré à l'étape suivante du projet.</p>
          </aside>
        </div>
      </div>
    </div>
  );
}
