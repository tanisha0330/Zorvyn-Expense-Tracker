import { createContext, useContext, useReducer, useCallback, useMemo, useEffect } from 'react';

// ─── Initial orders data (source of truth) ────────────────────────────────
const INITIAL_TRANSACTIONS = [
  { id: 1,  date: '2022-09-11', amount: 1456,   category: 'Software',     type: 'expense', status: 'Chargeback' },
  { id: 2,  date: '2022-09-11', amount: 42437,  category: 'Salary',       type: 'income',  status: 'Completed' },
  { id: 3,  date: '2022-09-11', amount: 3412,   category: 'Consulting',   type: 'income',  status: 'Completed' },
  { id: 4,  date: '2022-09-10', amount: 8920,   category: 'Marketing',    type: 'expense', status: 'Pending' },
  { id: 5,  date: '2022-09-09', amount: 2110,   category: 'Software',     type: 'expense', status: 'Cancelled' },
  { id: 6,  date: '2022-09-08', amount: 15300,  category: 'Salary',       type: 'income',  status: 'Completed' },
  { id: 7,  date: '2022-09-08', amount: 720,    category: 'Food',         type: 'expense', status: 'Completed' },
  { id: 8,  date: '2022-09-07', amount: 4800,   category: 'Advertising',  type: 'expense', status: 'Pending' },
  { id: 9,  date: '2022-09-07', amount: 6200,   category: 'Freelance',    type: 'income',  status: 'Completed' },
  { id: 10, date: '2022-09-06', amount: 350,    category: 'Food',         type: 'expense', status: 'Completed' },
  { id: 11, date: '2022-09-05', amount: 12500,  category: 'Salary',       type: 'income',  status: 'Completed' },
  { id: 12, date: '2022-09-05', amount: 1850,   category: 'Software',     type: 'expense', status: 'Completed' },
  { id: 13, date: '2022-09-04', amount: 920,    category: 'Utilities',    type: 'expense', status: 'Pending' },
  { id: 14, date: '2022-09-03', amount: 7600,   category: 'Consulting',   type: 'income',  status: 'Completed' },
  { id: 15, date: '2022-09-02', amount: 3100,   category: 'Marketing',    type: 'expense', status: 'Cancelled' },
];

const loadInitialState = () => {
  try {
    const savedState = localStorage.getItem('zorvyn_dashboard_state');
    if (savedState) {
      return JSON.parse(savedState);
    }
  } catch (e) {
    console.error('Failed to parse state from localStorage', e);
  }
  return {
    transactions: INITIAL_TRANSACTIONS,
    userRole: 'viewer',
    theme: 'light',
  };
};

function dashboardReducer(state, action) {
  switch (action.type) {
    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [
          { ...action.payload, id: Date.now() },
          ...state.transactions,
        ],
      };

    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter(t => t.id !== action.payload),
      };

    case 'EDIT_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map(t =>
          t.id === action.payload.id ? { ...t, ...action.payload.updates } : t
        ),
      };

    case 'SET_ROLE':
      return {
        ...state,
        userRole: action.payload,
      };

    case 'TOGGLE_THEME':
      return {
        ...state,
        theme: state.theme === 'light' ? 'dark' : 'light',
      };

    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────
const DashboardContext = createContext(null);

// ─── Provider ─────────────────────────────────────────────────────────────
export function DashboardProvider({ children }) {
  const [state, dispatch] = useReducer(dashboardReducer, null, loadInitialState);

  // Sync to localStorage and body theme
  useEffect(() => {
    document.body.setAttribute('data-theme', state.theme || 'light');
    localStorage.setItem('zorvyn_dashboard_state', JSON.stringify(state));
  }, [state]);

  // Memoised action creators
  const addTransaction = useCallback((transaction) => {
    dispatch({ type: 'ADD_TRANSACTION', payload: transaction });
  }, []);

  const deleteTransaction = useCallback((id) => {
    dispatch({ type: 'DELETE_TRANSACTION', payload: id });
  }, []);

  const editTransaction = useCallback((id, updates) => {
    dispatch({ type: 'EDIT_TRANSACTION', payload: { id, updates } });
  }, []);

  const setRole = useCallback((role) => {
    dispatch({ type: 'SET_ROLE', payload: role });
  }, []);

  const toggleTheme = useCallback(() => {
    dispatch({ type: 'TOGGLE_THEME' });
  }, []);

  // Computed helpers consumers can use
  const totalIncome = useMemo(
    () => state.transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0),
    [state.transactions]
  );

  const totalExpense = useMemo(
    () => state.transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0),
    [state.transactions]
  );

  const value = useMemo(() => ({
    transactions: state.transactions,
    userRole: state.userRole,
    theme: state.theme || 'light',
    addTransaction,
    deleteTransaction,
    editTransaction,
    setRole,
    toggleTheme,
    totalIncome,
    totalExpense,
  }), [state, addTransaction, deleteTransaction, editTransaction, setRole, toggleTheme, totalIncome, totalExpense]);

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

// ─── Custom hook ──────────────────────────────────────────────────────────
export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) {
    throw new Error('useDashboard must be used within a <DashboardProvider>');
  }
  return ctx;
}

export default DashboardContext;
