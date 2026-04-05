import { useState, useMemo } from 'react';
import { Plus, Search, Filter, Download, Pencil, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDashboard } from '../../context/DashboardContext';
import AddTransactionModal from '../AddTransactionModal/AddTransactionModal';
import './LastOrders.css';

// ─── Status config ────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  Chargeback: { color: '#4f6ef7' },
  Completed:  { color: '#6b6b72' },
  Pending:    { color: '#e8c84a' },
  Cancelled:  { color: '#e05c5c' },
};

// ─── Avatar helpers ───────────────────────────────────────────────────────
const CATEGORY_COLORS = {
  Software:    '#7acbe0',
  Salary:      '#a8d87a',
  Consulting:  '#e0a07a',
  Marketing:   '#c8a0e8',
  Food:        '#e07a9a',
  Advertising: '#7a8ae0',
  Freelance:   '#5bc9a0',
  Utilities:   '#e8c84a',
};

function getInitials(category) {
  return category.slice(0, 2).toUpperCase();
}

function getAvatarBg(category) {
  return CATEGORY_COLORS[category] || '#9a9a9e';
}

const DATE_LABELS = (() => {
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return (iso) => {
    const d = new Date(iso);
    return `${d.getDate().toString().padStart(2,'0')} ${months[d.getMonth()]} ${d.getFullYear()}`;
  };
})();

function LastOrders() {
  const { transactions, deleteTransaction, userRole } = useDashboard();

  const [searchTerm, setSearchTerm]     = useState('');
  const [filterType, setFilterType]     = useState('All');
  const [sortOption, setSortOption]     = useState('date-newest');
  const [isModalOpen, setIsModalOpen]   = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const openAddModal = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  const openEditModal = (order) => {
    setEditingTransaction(order);
    setIsModalOpen(true);
  };

  // Derived: filtered → sorted
  const visibleOrders = useMemo(() => {
    let result = transactions;

    // 1. Search by Category or ID
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      result = result.filter(t => 
        t.category.toLowerCase().includes(q) || 
        t.id.toString().includes(q)
      );
    }

    // 2. Filter by Type
    if (filterType !== 'All') {
      result = result.filter(t => t.type === filterType);
    }

    // 3. Sort
    result = [...result]; // sort mutates
    if (sortOption === 'date-newest') {
      result.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortOption === 'date-oldest') {
      result.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sortOption === 'amount-high') {
      result.sort((a, b) => b.amount - a.amount);
    }

    return result;
  }, [transactions, searchTerm, filterType, sortOption]);

  const exportCSV = () => {
    try {
      if (visibleOrders.length === 0) return;
      const headers = ['ID', 'Category', 'Amount', 'Type', 'Status', 'Date'];
      const rows = visibleOrders.map(o => [
        o.id,
        `"${o.category}"`,
        o.amount,
        o.type,
        o.status,
        `"${DATE_LABELS(o.date)}"`
      ].join(','));
      
      const csvContent = [headers.join(','), ...rows].join('\n');
      const blob = new Blob(["\ufeff", csvContent], { type: 'text/csv;charset=utf-8;' });
      
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        // IE11 fallback
        window.navigator.msSaveOrOpenBlob(blob, 'transactions_export.csv');
      } else {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'transactions_export.csv';
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Failed to export CSV:", error);
    }
  };

  return (
    <div className="last-orders">
      {/* ── Header ───────────────────────────── */}
      <div className="lo-header">
        <h2 className="lo-title">Last Orders</h2>
        <div className="lo-header__actions">
          <span className="lo-update-note">Data Updates Every 3 Hours</span>
          {userRole === 'admin' && (
            <button className="lo-add-btn" onClick={openAddModal}>
              <Plus size={14} strokeWidth={2.5} />
              <span>Add New Transaction</span>
            </button>
          )}
          <button className="lo-export-btn" onClick={exportCSV} disabled={visibleOrders.length === 0}>
            <Download size={14} strokeWidth={2.5} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* ── Control Bar ──────────────────────── */}
      <div className="lo-controls">
        <div className="lo-search">
          <Search size={14} className="lo-search-icon" />
          <input
            type="text"
            className="lo-search-input"
            placeholder="Search by category or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="lo-filters">
          <div className="lo-filter-group">
            <Filter size={14} className="lo-filter-icon" />
            <select 
              className="lo-select"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="All">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          <div className="lo-filter-group">
            <select 
              className="lo-select"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="date-newest">Date: Newest First</option>
              <option value="date-oldest">Date: Oldest First</option>
              <option value="amount-high">Amount: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Table ────────────────────────────── */}
      <div className="lo-table-wrap">
        <table className="lo-table" role="table">
          <thead>
            <tr>
              <th className="lo-th">Name</th>
              <th className="lo-th">Amount</th>
              <th className="lo-th">Status</th>
              <th className="lo-th">Date</th>
              {userRole === 'admin' && <th className="lo-th">Action</th>}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {visibleOrders.map((order, i) => {
                const statusCfg = STATUS_CONFIG[order.status] || { color: '#9a9a9e' };
                return (
                  <motion.tr 
                    key={order.id} 
                    className="lo-row"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ delay: i * 0.05, duration: 0.2 }}
                  >
                    <td className="lo-td lo-td--name">
                      <span className="lo-avatar" style={{ background: getAvatarBg(order.category) }}>
                        {getInitials(order.category)}
                      </span>
                      <span>{order.category}</span>
                    </td>
                    <td className="lo-td">
                      <span className={order.type === 'income' ? 'lo-amt-income' : 'lo-amt-expense'}>
                        {order.type === 'income' ? '+' : '-'} ${order.amount.toLocaleString()}
                      </span>
                    </td>
                    <td className="lo-td lo-td--status">
                      <span className="lo-status-dot" style={{ background: statusCfg.color }} />
                      <span>{order.status}</span>
                    </td>
                    <td className="lo-td lo-td--date">{DATE_LABELS(order.date)}</td>
                    {userRole === 'admin' && (
                      <td className="lo-td lo-td-actions">
                        <button
                          className="lo-edit-btn"
                          onClick={() => openEditModal(order)}
                          aria-label={`Edit order ${order.id}`}
                        >
                          <Pencil size={12} strokeWidth={2.5} />
                        </button>
                        <button
                          className="lo-delete-btn"
                          onClick={() => deleteTransaction(order.id)}
                          aria-label={`Delete order ${order.id}`}
                        >
                          <Trash2 size={13} strokeWidth={2.5} />
                        </button>
                      </td>
                    )}
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>

        {/* Empty State */}
        {visibleOrders.length === 0 && (
          <div className="lo-empty-state">
            <div className="lo-empty-icon">
              <Search size={32} />
            </div>
            <h3 className="lo-empty-title">No transactions found</h3>
            <p className="lo-empty-desc">There are no transactions matching your current search or filter criteria.</p>
            <button className="lo-empty-clear" onClick={() => {
              setSearchTerm('');
              setFilterType('All');
            }}>
              Clear Filters
            </button>
          </div>
        )}
      </div>

      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingTransaction={editingTransaction}
      />
    </div>
  );
}

export default LastOrders;
