import { LayoutGrid } from 'lucide-react';
import UserAvatar from '../UserAvatar/UserAvatar';
import NavLinks from '../NavLinks/NavLinks';
import './Sidebar.css';

function Sidebar() {
  return (
    <aside className="sidebar">
      {/* ── Brand Logo ─────────────────────── */}
      <div className="sidebar-brand">
        <LayoutGrid size={20} strokeWidth={2} className="brand-icon" />
        <span className="brand-name">Zarss</span>
      </div>

      {/* ── User Profile ───────────────────── */}
      <UserAvatar />

      {/* ── Navigation ─────────────────────── */}
      <nav className="sidebar-nav" aria-label="Main navigation">
        <NavLinks />
      </nav>
    </aside>
  );
}

export default Sidebar;
