import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="page-narrow" style={{ textAlign: 'center' }}>
      <span className="eyebrow">Erreur 404</span>
      <h1 style={{ fontSize: 'clamp(3rem, 8vw, 6rem)' }}>Page introuvable</h1>
      <p style={{ maxWidth: 480, margin: '0 auto 32px' }}>
        Cette page semble s'être égarée dans nos rayonnages. Revenons à l'essentiel.
      </p>
      <Link to="/" className="btn btn-gold btn-lg">Retour à l'accueil</Link>
    </div>
  );
}
