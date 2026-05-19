import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import './AdminLayout.css';

const NAV = [
  { to: '/admin', label: "Vue d'ensemble", end: true, icon: 'grid' },
  { to: '/admin/ouvrages', label: 'Ouvrages', icon: 'book' },
  { to: '/admin/categories', label: 'Catégories', icon: 'tag' },
];

function Icon({ name }) {
  const props = {
    width: 18,
    height: 18,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  };
  if (name === 'grid') return (
    <svg {...props}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
  );
  if (name === 'book') return (
    <svg {...props}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/></svg>
  );
  if (name === 'tag') return (
    <svg {...props}><path d="M20 12V7a2 2 0 0 0-2-2h-5L3 15l6 6 11-11Z"/><circle cx="9" cy="11" r="1.5"/></svg>
  );
  return null;
}

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="admin">
      <aside className="admin__sidebar">
        <Link to="/" className="admin__brand">
          <Logo size={44} variant="light" />
        </Link>
        <span className="admin__brand-sub">Espace administrateur</span>

        <nav className="admin__nav">
          {NAV.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className="admin__nav-link">
              <Icon name={item.icon} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="admin__user">
          <div className="admin__user-chip">
            {(user?.email || user?.role || 'A').slice(0, 1).toUpperCase()}
          </div>
          <div className="admin__user-meta">
            <strong>{user?.email || 'Administrateur'}</strong>
            <span>{user?.role || 'staff'}</span>
          </div>
        </div>
        <button className="admin__logout" onClick={handleLogout}>Déconnexion</button>
      </aside>

      <main className="admin__main">
        <Outlet />
      </main>
    </div>
  );
}
