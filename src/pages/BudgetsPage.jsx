import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  AlertCircle, CheckCircle, Plus, X, Edit2, Target, RotateCcw, TrendingUp,
} from 'lucide-react';

const EXPENSE_CATS = [
  'Housing','Food & Dining','Transportation','Utilities','Shopping',
  'Healthcare','Insurance','Travel','Subscriptions','Entertainment','Education','Other',
];
const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function progressColor(pct) {
  if (pct >= 100) return { bar: '#D82C0D', text: 'text-[#D82C0D] dark:text-[#FF3B30]', alert: 'bg-[#FEF0EE] dark:bg-[#2A0A08] border-[#D82C0D]/20' };
  if (pct >= 80)  return { bar: '#F59E0B', text: 'text-amber-500', alert: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800' };
  return              { bar: '#008060', text: 'text-[#008060] dark:text-[#00E676]', alert: 'bg-[#E6F4EF] dark:bg-[#0A2018] border-[#008060]/20' };
}

const inputCls = "px-3 py-2 text-sm border border-[#E5E5E5] dark:border-[#262626] rounded-md bg-white dark:bg-[#1A1A1A] text-[#0A0A0A] dark:text-[#F7F7F5] focus:outline-none focus:ring-2 focus:ring-[#0033CC] transition-colors";

export default function BudgetsPage() {
  const { transactions, budgets, setBudget, removeBudget, resetBudgets, role } = useApp();

  const [selectedMonth, setSelectedMonth] = useState('all');
  const [showAdd, setShowAdd]             = useState(false);
  const [newCat, setNewCat]               = useState('');
  const [newAmt, setNewAmt]               = useState('');
  const [editingCat, setEditingCat]       = useState(null);
  const [editAmt, setEditAmt]             = useState('');

  const months = useMemo(() =>
    [...new Set(transactions.map(t => t.date.substring(0, 7)))].sort(), [transactions]);

  const monthLabel = m => {
    const [y, mo] = m.split('-');
    return `${MONTH_NAMES[parseInt(mo, 10) - 1]} ${y}`;
  };

  const spending = useMemo(() => {
    const rows = selectedMonth === 'all' ? transactions : transactions.filter(t => t.date.startsWith(selectedMonth));
    const map = {};
    rows.filter(t => t.type === 'expense').forEach(t => { map[t.category] = (map[t.category] || 0) + t.amount; });
    return map;
  }, [transactions, selectedMonth]);

  const entries = useMemo(() => {
    const mult = selectedMonth === 'all' ? months.length : 1;
    return Object.entries(budgets)
      .map(([cat, monthly]) => {
        const total     = monthly * mult;
        const spent     = spending[cat] || 0;
        const pct       = total > 0 ? (spent / total) * 100 : 0;
        const remaining = total - spent;
        return { cat, monthly, total, spent, pct, remaining };
      })
      .sort((a, b) => b.pct - a.pct);
  }, [budgets, spending, months, selectedMonth]);

  const alerts    = entries.filter(e => e.pct >= 80);
  const unbudgeted = Object.keys(spending).filter(c => !budgets[c]);

  const handleAdd = () => {
    const v = parseFloat(newAmt);
    const cat = newCat || EXPENSE_CATS.filter(c => !budgets[c])[0];
    if (!isNaN(v) && v > 0 && cat) { setBudget(cat, v); setNewAmt(''); setShowAdd(false); }
  };

  const handleSaveEdit = () => {
    const v = parseFloat(editAmt);
    if (!isNaN(v) && v > 0) setBudget(editingCat, v);
    setEditingCat(null);
  };

  const availableCats = EXPENSE_CATS.filter(c => !budgets[c]);

  return (
    <div className="space-y-6 animate-fade-up" data-testid="budgets-page">
      {/* Page Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10px] text-[#525252] dark:text-[#A3A3A3] tracking-[0.2em] uppercase font-medium">Finance</p>
          <h1 className="text-3xl md:text-4xl font-bold text-[#0A0A0A] dark:text-[#F7F7F5] mt-1 tracking-tight" style={{ fontFamily: 'Cabinet Grotesk, sans-serif' }}>
            Budget Goals
          </h1>
          <p className="text-sm text-[#525252] dark:text-[#A3A3A3] mt-1">
            Monthly spending limits per category &bull;{' '}
            {role === 'Admin' ? <span className="text-[#0033CC] dark:text-[#2952CC] font-medium">Admin: can edit</span> : 'Viewer mode'}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={selectedMonth}
            onChange={e => setSelectedMonth(e.target.value)}
            data-testid="budget-month-selector"
            className="px-3 py-2 text-xs border border-[#E5E5E5] dark:border-[#262626] rounded-md bg-white dark:bg-[#1A1A1A] text-[#0A0A0A] dark:text-[#F7F7F5] focus:outline-none focus:ring-2 focus:ring-[#0033CC]"
          >
            <option value="all">All Months</option>
            {months.map(m => <option key={m} value={m}>{monthLabel(m)}</option>)}
          </select>

          {role === 'Admin' && (
            <>
              <button
                onClick={() => setShowAdd(!showAdd)}
                data-testid="add-budget-btn"
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-[#0A0A0A] dark:bg-[#F7F7F5] text-white dark:text-[#0A0A0A] rounded-md hover:opacity-90 transition-opacity"
              >
                <Plus size={13} /> Set Budget
              </button>
              <button
                onClick={resetBudgets}
                data-testid="reset-budgets-btn"
                title="Reset to defaults"
                className="p-2 text-xs border border-[#E5E5E5] dark:border-[#262626] rounded-md text-[#A3A3A3] hover:bg-[#F7F7F5] dark:hover:bg-[#1A1A1A] transition-colors"
              >
                <RotateCcw size={13} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Add Budget Form */}
      {showAdd && role === 'Admin' && (
        <div className="bg-white dark:bg-[#121212] border border-[#E5E5E5] dark:border-[#262626] rounded-md p-5" data-testid="add-budget-form">
          <p className="text-[10px] text-[#525252] dark:text-[#A3A3A3] tracking-[0.2em] uppercase font-medium mb-4">New Budget</p>
          <div className="flex flex-wrap items-end gap-3">
            <div>
              <label className="block text-xs text-[#525252] dark:text-[#A3A3A3] mb-1.5">Category</label>
              <select value={newCat || availableCats[0] || ''} onChange={e => setNewCat(e.target.value)} className={inputCls} data-testid="new-budget-category">
                {availableCats.length === 0
                  ? <option disabled>All categories budgeted</option>
                  : availableCats.map(c => <option key={c}>{c}</option>)
                }
              </select>
            </div>
            <div>
              <label className="block text-xs text-[#525252] dark:text-[#A3A3A3] mb-1.5">Monthly Budget ($)</label>
              <input
                type="number" min="1" step="10" placeholder="e.g. 500"
                value={newAmt} onChange={e => setNewAmt(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAdd()}
                className={`${inputCls} w-32`} data-testid="new-budget-amount"
              />
            </div>
            <button onClick={handleAdd} data-testid="confirm-add-budget-btn" className="px-4 py-2 text-sm bg-[#0A0A0A] dark:bg-[#F7F7F5] text-white dark:text-[#0A0A0A] rounded-md hover:opacity-90 font-medium">
              Add
            </button>
            <button onClick={() => setShowAdd(false)} className="px-4 py-2 text-sm border border-[#E5E5E5] dark:border-[#262626] rounded-md text-[#525252] dark:text-[#A3A3A3] hover:bg-[#F7F7F5] dark:hover:bg-[#262626]">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-2" data-testid="budget-alerts-section">
          {alerts.map(({ cat, spent, total, pct }) => {
            const { alert } = progressColor(pct);
            const isOver = pct >= 100;
            return (
              <div key={cat} className={`flex items-start gap-3 p-3.5 border rounded-md ${alert}`}>
                <AlertCircle size={15} className={`mt-0.5 shrink-0 ${isOver ? 'text-[#D82C0D] dark:text-[#FF3B30]' : 'text-amber-500'}`} />
                <p className="text-sm text-[#0A0A0A] dark:text-[#F7F7F5]">
                  <strong>{cat}</strong> {isOver ? 'has exceeded its budget' : `is at ${pct.toFixed(0)}% of budget`} — spent{' '}
                  <span className={`font-semibold ${isOver ? 'text-[#D82C0D] dark:text-[#FF3B30]' : 'text-amber-500'}`}>
                    ${spent.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                  </span>{' '}
                  of ${total.toLocaleString('en-US', { maximumFractionDigits: 0 })} budget
                  {selectedMonth === 'all' ? ` (${months.length}-month total)` : ''}.
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Budget Cards Grid */}
      {entries.length === 0 ? (
        <div className="bg-white dark:bg-[#121212] border border-[#E5E5E5] dark:border-[#262626] rounded-md p-14 text-center" data-testid="empty-budgets">
          <Target size={36} className="text-[#A3A3A3] mx-auto mb-3" />
          <p className="text-sm font-semibold text-[#0A0A0A] dark:text-[#F7F7F5]">No budgets configured</p>
          <p className="text-xs text-[#A3A3A3] mt-1">
            {role === 'Admin' ? 'Click "Set Budget" above to add spending limits.' : 'No budgets have been set up yet.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {entries.map(({ cat, monthly, total, spent, pct, remaining }) => {
            const { bar, text } = progressColor(pct);
            const isOver = pct >= 100;
            return (
              <div key={cat} className="bg-white dark:bg-[#121212] border border-[#E5E5E5] dark:border-[#262626] rounded-md p-5 hover:shadow-sm transition-shadow" data-testid={`budget-card-${cat.replace(/[\s&]/g, '-').toLowerCase()}`}>
                {/* Card Header */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-[10px] text-[#525252] dark:text-[#A3A3A3] tracking-[0.15em] uppercase font-medium">{cat}</p>
                    <p className="text-xs text-[#A3A3A3] mt-0.5">
                      ${monthly.toLocaleString()}/mo{selectedMonth === 'all' ? ` × ${months.length}` : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    {remaining === 0 && isOver
                      ? <span className="px-1.5 py-0.5 text-[10px] font-bold bg-amber-500 text-white rounded-sm">FULL</span>
                      : isOver
                      ? <span className="px-1.5 py-0.5 text-[10px] font-bold bg-[#D82C0D] text-white rounded-sm">OVER</span>
                      : <span className={`px-1.5 py-0.5 text-[10px] font-medium rounded-sm ${text} ${pct >= 80 ? 'bg-amber-50 dark:bg-amber-950/40' : 'bg-[#E6F4EF] dark:bg-[#0A2018]'}`}>{pct.toFixed(0)}%</span>
                    }
                    {role === 'Admin' && editingCat !== cat && (
                      <button
                        onClick={() => { setEditingCat(cat); setEditAmt(monthly.toString()); }}
                        data-testid={`edit-budget-${cat.replace(/[\s&]/g, '-').toLowerCase()}`}
                        className="p-1 rounded text-[#A3A3A3] hover:text-[#0033CC] hover:bg-blue-50 dark:hover:bg-[#1A2040] transition-colors"
                      >
                        <Edit2 size={12} />
                      </button>
                    )}
                    {role === 'Admin' && (
                      <button
                        onClick={() => removeBudget(cat)}
                        data-testid={`remove-budget-${cat.replace(/[\s&]/g, '-').toLowerCase()}`}
                        className="p-1 rounded text-[#A3A3A3] hover:text-[#D82C0D] hover:bg-[#FEF0EE] dark:hover:bg-[#2A0A08] transition-colors"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Inline Edit */}
                {editingCat === cat && role === 'Admin' && (
                  <div className="flex items-center gap-2 mb-3">
                    <input
                      type="number" min="1" autoFocus
                      value={editAmt} onChange={e => setEditAmt(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') handleSaveEdit(); if (e.key === 'Escape') setEditingCat(null); }}
                      className="w-24 px-2 py-1 text-sm border border-[#0033CC] rounded-md bg-transparent text-[#0A0A0A] dark:text-[#F7F7F5] focus:outline-none"
                      data-testid={`budget-edit-input-${cat.replace(/[\s&]/g, '-').toLowerCase()}`}
                    />
                    <button onClick={handleSaveEdit} className="px-2 py-1 text-xs bg-[#0A0A0A] dark:bg-[#F7F7F5] text-white dark:text-[#0A0A0A] rounded font-medium">Save</button>
                    <button onClick={() => setEditingCat(null)} className="px-2 py-1 text-xs text-[#A3A3A3] hover:text-[#525252]">✕</button>
                  </div>
                )}

                {/* Progress Bar */}
                <div className="h-2 w-full bg-[#F0F0F0] dark:bg-[#262626] rounded-full overflow-hidden mb-3">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: bar }}
                  />
                </div>

                {/* Amounts */}
                <div className="flex justify-between text-xs mb-1.5">
                  <div>
                    <span className="text-[#A3A3A3]">Spent </span>
                    <span className={`font-semibold tabular-nums ${text}`}>${spent.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div>
                    <span className="text-[#A3A3A3]">of </span>
                    <span className="font-medium text-[#0A0A0A] dark:text-[#F7F7F5] tabular-nums">${total.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
                  </div>
                </div>

                {/* Remaining */}
                <div className={`text-xs font-semibold ${isOver && remaining !== 0 ? 'text-[#D82C0D] dark:text-[#FF3B30]' : remaining === 0 ? 'text-amber-500' : 'text-[#008060] dark:text-[#00E676]'}`}>
                  {remaining === 0
                    ? 'At budget limit'
                    : isOver
                    ? `$${Math.abs(remaining).toLocaleString('en-US', { maximumFractionDigits: 0 })} over budget`
                    : `$${remaining.toLocaleString('en-US', { maximumFractionDigits: 0 })} remaining`
                  }
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Unbudgeted Categories (Admin only) */}
      {role === 'Admin' && unbudgeted.length > 0 && (
        <div className="bg-white dark:bg-[#121212] border border-dashed border-[#A3A3A3] dark:border-[#525252] rounded-md p-5" data-testid="unbudgeted-section">
          <p className="text-[10px] text-[#525252] dark:text-[#A3A3A3] tracking-[0.2em] uppercase font-medium mb-3">
            Unbudgeted Categories — {unbudgeted.length} with spending
          </p>
          <div className="flex flex-wrap gap-2">
            {unbudgeted.map(cat => (
              <button
                key={cat}
                onClick={() => { setNewCat(cat); setShowAdd(true); }}
                data-testid={`quick-budget-${cat.replace(/[\s&]/g, '-').toLowerCase()}`}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-dashed border-[#A3A3A3] dark:border-[#525252] rounded-md text-[#525252] dark:text-[#A3A3A3] hover:border-[#0033CC] hover:text-[#0033CC] transition-colors"
              >
                <Plus size={11} />
                {cat} <span className="text-[#A3A3A3]">(${(spending[cat] || 0).toLocaleString('en-US', { maximumFractionDigits: 0 })} spent)</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
