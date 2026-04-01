import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockTransactions } from '../data/mockData';
import { toast } from '../hooks/use-toast';

const AppContext = createContext(null);

const DEFAULT_BUDGETS = {
  Housing:        1900,
  'Food & Dining': 450,
  Transportation:  150,
  Utilities:       120,
  Shopping:        250,
  Healthcare:      100,
  Insurance:       130,
  Travel:          150,
  Subscriptions:    35,
  Entertainment:    80,
  Education:        60,
};

export function AppProvider({ children }) {
  const [darkMode, setDarkMode] = useState(() => {
    try { return JSON.parse(localStorage.getItem('fintrack_dark')) ?? false; }
    catch { return false; }
  });

  const [role, setRole] = useState(() => {
    return localStorage.getItem('fintrack_role') || 'Admin';
  });

  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem('fintrack_txns');
      return saved ? JSON.parse(saved) : mockTransactions;
    } catch { return mockTransactions; }
  });

  const [budgets, setBudgetsState] = useState(() => {
    try {
      const saved = localStorage.getItem('fintrack_budgets');
      return saved ? JSON.parse(saved) : DEFAULT_BUDGETS;
    } catch { return DEFAULT_BUDGETS; }
  });

  // Dark mode sync
  useEffect(() => {
    document.documentElement.classList[darkMode ? 'add' : 'remove']('dark');
    localStorage.setItem('fintrack_dark', JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => { localStorage.setItem('fintrack_role', role); }, [role]);
  useEffect(() => { localStorage.setItem('fintrack_txns', JSON.stringify(transactions)); }, [transactions]);
  useEffect(() => { localStorage.setItem('fintrack_budgets', JSON.stringify(budgets)); }, [budgets]);

  const addTransaction = (data) => {
    setTransactions((prev) => [{ ...data, id: `tx_${Date.now()}` }, ...prev]);
    toast({ title: 'Transaction added', variant: 'success' });
  };

  const editTransaction = (id, data) => {
    setTransactions((prev) => prev.map((t) => (t.id === id ? { ...t, ...data } : t)));
    toast({ title: 'Transaction updated', variant: 'success' });
  };

  const deleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    toast({ title: 'Transaction deleted', variant: 'destructive' });
  };
  const resetToMockData   = () => setTransactions(mockTransactions);

  const setBudget = (cat, amount) => {
    setBudgetsState((prev) => ({ ...prev, [cat]: amount }));
    toast({ title: 'Budget updated', description: cat, variant: 'success' });
  };

  const removeBudget = (cat) => {
    setBudgetsState((prev) => {
      const n = { ...prev };
      delete n[cat];
      return n;
    });
    toast({ title: 'Budget deleted', description: cat, variant: 'destructive' });
  };
  const resetBudgets = () => setBudgetsState(DEFAULT_BUDGETS);

  return (
    <AppContext.Provider value={{
      darkMode, setDarkMode,
      role, setRole,
      transactions, addTransaction, editTransaction, deleteTransaction, resetToMockData,
      budgets, setBudget, removeBudget, resetBudgets,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
