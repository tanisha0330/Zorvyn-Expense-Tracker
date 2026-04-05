import { useState } from 'react';
import {
  LayoutDashboard,
  BarChart2,
  CreditCard,
  ArrowLeftRight,
  ShoppingBag,
  Users,
  MessageSquare,
  Settings,
  LogOut,
} from 'lucide-react';
import './NavLinks.css';

// ─── Static nav data — add/remove links here ──────────────────────────────
const navLinks = [
  { id: 'dashboard',    icon: LayoutDashboard,  label: 'Dashboard' },
  { id: 'statistics',   icon: BarChart2,         label: 'Statistics' },
  { id: 'payment',      icon: CreditCard,        label: 'Payment' },
  { id: 'transactions', icon: ArrowLeftRight,    label: 'Transactions' },
  { id: 'products',     icon: ShoppingBag,       label: 'Products' },
  { id: 'customer',     icon: Users,             label: 'Customer' },
  { id: 'messages',     icon: MessageSquare,     label: 'Messages', badge: 5 },
  { id: 'settings',     icon: Settings,          label: 'Settings' },
];

function NavLinks() {
  const [activeId, setActiveId] = useState('dashboard');

  return (
    <div className="nav-wrapper">
      {/* Main navigation */}
      <ul className="nav-list" role="list">
        {navLinks.map(({ id, icon: Icon, label, badge }) => {
          const isActive = activeId === id;
          return (
            <li key={id}>
              <button
                className={`nav-link ${isActive ? 'nav-link--active' : ''}`}
                onClick={() => setActiveId(id)}
                aria-current={isActive ? 'page' : undefined}
              >
                {/* Yellow left-edge indicator */}
                <span className="nav-link__indicator" aria-hidden="true" />

                <Icon
                  size={18}
                  strokeWidth={isActive ? 2.2 : 1.8}
                  className="nav-link__icon"
                  aria-hidden="true"
                />
                <span className="nav-link__label">{label}</span>
                {badge && (
                  <span className="nav-link__badge" aria-label={`${badge} unread`}>
                    {badge}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>

      {/* Log Out — pinned at bottom */}
      <div className="nav-logout">
        <button
          className="nav-link nav-link--logout"
          onClick={() => console.log('Log out clicked')}
        >
          <span className="nav-link__indicator" aria-hidden="true" />
          <LogOut size={18} strokeWidth={1.8} className="nav-link__icon" aria-hidden="true" />
          <span className="nav-link__label">Log Out</span>
        </button>
      </div>
    </div>
  );
}

export default NavLinks;
