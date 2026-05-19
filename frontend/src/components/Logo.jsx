// To use your custom PNG logo:
//   1. Save your image at frontend/src/assets/logo.png
//   2. Change the import below from './logo.svg' to './logo.png'
import logoSrc from '../assets/logo.svg';
import './Logo.css';

export default function Logo({ size = 42, withWordmark = true, variant = 'dark', to = null }) {
  return (
    <span className={`lg-logo lg-logo--${variant}`} style={{ '--logo-size': `${size}px` }}>
      <img
        src={logoSrc}
        alt="Livres Gourmands"
        className="lg-logo__mark"
        draggable="false"
        width={size}
        height={size}
      />
      {withWordmark && (
        <span className="lg-logo__text">
          <span className="lg-logo__name">Livres Gourmands</span>
          <span className="lg-logo__sub">Maison fondée en 2025</span>
        </span>
      )}
    </span>
  );
}
