import { Search, ShieldCheck, Eye, Sun, Moon } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import './Header.css';

function Header() {
  const { userRole, setRole, theme, toggleTheme } = useDashboard();

  return (
    <header className="dashboard-header">
      <div className="header-title-group">
        <h1 className="header-title">Dashboard</h1>
        <p className="header-subtitle">Payments Updates</p>
      </div>

      <div className="header-right">
        {/* Theme toggle */}
        <button
          className="theme-toggle-btn"
          onClick={toggleTheme}
          aria-label="Toggle dark mode"
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Role toggle */}
        <div className="role-toggle">
          <button
            className={`role-toggle__btn ${userRole === 'viewer' ? 'role-toggle__btn--active' : ''}`}
            onClick={() => setRole('viewer')}
            aria-pressed={userRole === 'viewer'}
          >
            <Eye size={13} strokeWidth={2} />
            <span>Viewer</span>
          </button>
          <button
            className={`role-toggle__btn ${userRole === 'admin' ? 'role-toggle__btn--active role-toggle__btn--admin' : ''}`}
            onClick={() => setRole('admin')}
            aria-pressed={userRole === 'admin'}
          >
            <ShieldCheck size={13} strokeWidth={2} />
            <span>Admin</span>
          </button>
        </div>

        {/* Search */}
        <div className="header-search">
          <Search size={15} strokeWidth={2} className="search-icon" />
          <input
            id="dashboard-search"
            type="text"
            placeholder="Search"
            className="search-input"
            aria-label="Search dashboard"
          />
        </div>
      </div>
    </header>
  );
}

export default Header;
