import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDashboard } from '../../context/DashboardContext';
import './AddTransactionModal.css';

const CATEGORIES = ['Salary', 'Consulting', 'Freelance', 'Software', 'Marketing', 'Advertising', 'Food', 'Utilities'];
const TYPES      = ['income', 'expense'];
const STATUSES   = ['Completed', 'Pending'];

const defaultForm = {
  amount: '',
  category: CATEGORIES[0],
  type: TYPES[0],
  status: STATUSES[0],
  date: new Date().toISOString().slice(0, 10),
};

function AddTransactionModal({ isOpen, onClose, editingTransaction }) {
  const { addTransaction, editTransaction } = useDashboard();
  const [form, setForm] = useState(defaultForm);

  const isEditMode = Boolean(editingTransaction);

  // Pre-fill form when editing
  useEffect(() => {
    if (editingTransaction) {
      setForm({
        amount: String(editingTransaction.amount),
        category: editingTransaction.category,
        type: editingTransaction.type,
        status: editingTransaction.status,
        date: editingTransaction.date,
      });
    } else {
      setForm(defaultForm);
    }
  }, [editingTransaction]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.amount || Number(form.amount) <= 0) return;

    const payload = {
      amount:   Number(form.amount),
      category: form.category,
      type:     form.type,
      status:   form.status,
      date:     form.date,
    };

    if (isEditMode) {
      editTransaction(editingTransaction.id, payload);
    } else {
      addTransaction(payload);
    }

    setForm(defaultForm);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="modal-overlay" 
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <motion.div 
            className="modal-card" 
            onClick={e => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 400 }}
          >
            {/* Header */}
            <div className="modal-header">
              <h2 className="modal-title">{isEditMode ? 'Edit Transaction' : 'Add Transaction'}</h2>
              <button className="modal-close" onClick={onClose} aria-label="Close">
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form className="modal-form" onSubmit={handleSubmit}>
              {/* Amount */}
              <label className="modal-field">
                <span className="modal-label">Amount ($)</span>
                <input
                  className="modal-input"
                  type="number"
                  name="amount"
                  min="1"
                  step="0.01"
                  placeholder="e.g. 1500"
                  value={form.amount}
                  onChange={handleChange}
                  required
                  autoFocus
                />
              </label>

              {/* Category */}
              <label className="modal-field">
                <span className="modal-label">Category</span>
                <select className="modal-select" name="category" value={form.category} onChange={handleChange}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </label>

              {/* Type */}
              <label className="modal-field">
                <span className="modal-label">Type</span>
                <div className="modal-type-group">
                  {TYPES.map(t => (
                    <button
                      key={t}
                      type="button"
                      className={`modal-type-btn ${form.type === t ? `modal-type-btn--active modal-type-btn--${t}` : ''}`}
                      onClick={() => setForm(prev => ({ ...prev, type: t }))}
                    >
                      {t === 'income' ? '↗ Income' : '↘ Expense'}
                    </button>
                  ))}
                </div>
              </label>

              {/* Status */}
              <label className="modal-field">
                <span className="modal-label">Status</span>
                <select className="modal-select" name="status" value={form.status} onChange={handleChange}>
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </label>

              {/* Date */}
              <label className="modal-field">
                <span className="modal-label">Date</span>
                <input
                  className="modal-input"
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                />
              </label>

              {/* Submit */}
              <button className="modal-submit" type="submit">
                {isEditMode ? 'Save Changes' : 'Add Transaction'}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default AddTransactionModal;
