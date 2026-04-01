import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search, Plus, Edit2, Trash2, ArrowUpDown, ChevronUp, ChevronDown,
  Download, RotateCcw, Calendar, X,
} from 'lucide-react';
import TransactionModal from './TransactionModal';

const PAGE_SIZE = 10;

function exportCSV(rows) {
  const headers = ['Date','Description','Category','Type','Amount','Merchant'];
  const csv = [headers, ...rows.map(t => [t.date, t.description, t.category, t.type, t.amount.toFixed(2), t.merchant || ''])].map(r => r.join(',')).join('\n');
  const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(new Blob([csv], { type: 'text/csv' })), download: 'transactions.csv' });
  a.click();
}

function exportJSON(rows) {
  const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(new Blob([JSON.stringify(rows, null, 2)], { type: 'application/json' })), download: 'transactions.json' });
  a.click();
}

const dateCls = "px-2.5 py-1.5 text-xs border border-[#E5E5E5] dark:border-[#262626] rounded-md bg-white dark:bg-[#1A1A1A] text-[#0A0A0A] dark:text-[#F7F7F5] focus:outline-none focus:ring-2 focus:ring-[#0033CC] transition-colors";

export default function TransactionsTable() {
  const { transactions, role, deleteTransaction, resetToMockData } = useApp();
  const [search, setSearch]            = useState('');
  const [typeFilter, setTypeFilter]    = useState('All');
  const [catFilter, setCatFilter]      = useState('All');
  const [dateFrom, setDateFrom]        = useState('');
  const [dateTo, setDateTo]            = useState('');
  const [sortKey, setSortKey]          = useState('date');
  const [sortDir, setSortDir]          = useState('desc');
  const [page, setPage]                = useState(1);
  const [modalOpen, setModalOpen]      = useState(false);
  const [editingTx, setEditingTx]      = useState(null);
  const [exportOpen, setExportOpen]    = useState(false);
  const exportRef                      = useRef(null);

  const allCats = useMemo(() =>
    ['All', ...[...new Set(transactions.map(t => t.category))].sort()], [transactions]);

  useEffect(() => {
    const h = e => { if (exportRef.current && !exportRef.current.contains(e.target)) setExportOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const handleSort = key => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  };

  const filtered = useMemo(() => {
    let rows = [...transactions];
    if (search) {
      const q = search.toLowerCase();
      rows = rows.filter(t =>
        t.description?.toLowerCase().includes(q) ||
        t.merchant?.toLowerCase().includes(q) ||
        t.category?.toLowerCase().includes(q)
      );
    }
    if (typeFilter !== 'All') rows = rows.filter(t => t.type === typeFilter.toLowerCase());
    if (catFilter  !== 'All') rows = rows.filter(t => t.category === catFilter);
    if (dateFrom)             rows = rows.filter(t => t.date >= dateFrom);
    if (dateTo)               rows = rows.filter(t => t.date <= dateTo);

    rows.sort((a, b) => {
      let av = a[sortKey], bv = b[sortKey];
      if (sortKey === 'date')   { av = new Date(av); bv = new Date(bv); }
      if (sortKey === 'amount') { av = Number(av);   bv = Number(bv); }
      return sortDir === 'asc' ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
    });
    return rows;
  }, [transactions, search, typeFilter, catFilter, dateFrom, dateTo, sortKey, sortDir]);

  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const hasDateFilter = dateFrom || dateTo;

  const clearFilters = () => { setSearch(''); setTypeFilter('All'); setCatFilter('All'); setDateFrom(''); setDateTo(''); setPage(1); };

  const SortIcon = ({ col }) => {
    if (sortKey !== col) return <ArrowUpDown size={13} className="text-[#A3A3A3]" />;
    return sortDir === 'asc'
      ? <ChevronUp   size={13} className="text-[#0033CC]" />
      : <ChevronDown size={13} className="text-[#0033CC]" />;
  };

  const fmtDate = d => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <>
      <div className="bg-white dark:bg-[#121212] border border-[#E5E5E5] dark:border-[#262626] rounded-md" data-testid="transactions-table">
        {/* ── Toolbar ── */}
        <div className="p-5 md:p-6 border-b border-[#E5E5E5] dark:border-[#262626] space-y-3">
          {/* Row 1: title + actions */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[10px] text-[#525252] dark:text-[#A3A3A3] tracking-[0.2em] uppercase font-medium">Transactions</p>
              <p className="text-xs text-[#A3A3A3] mt-0.5">{filtered.length} of {transactions.length} records</p>
            </div>
            <div className="flex items-center gap-2">
              {/* Export dropdown */}
              <div className="relative" ref={exportRef}>
                <button onClick={() => setExportOpen(!exportOpen)} data-testid="export-btn"
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium border border-[#E5E5E5] dark:border-[#262626] rounded-md text-[#525252] dark:text-[#A3A3A3] hover:bg-[#F7F7F5] dark:hover:bg-[#1A1A1A] transition-colors">
                  <Download size={13} /> Export
                </button>
                {exportOpen && (
                  <div className="absolute right-0 top-full mt-1 bg-white dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#262626] rounded-md shadow-lg z-20 min-w-[130px]">
                    <button onClick={() => { exportCSV(filtered); setExportOpen(false); }} data-testid="export-csv" className="block w-full text-left px-4 py-2.5 text-xs text-[#0A0A0A] dark:text-[#F7F7F5] hover:bg-[#F7F7F5] dark:hover:bg-[#262626]">Export CSV</button>
                    <button onClick={() => { exportJSON(filtered); setExportOpen(false); }} data-testid="export-json" className="block w-full text-left px-4 py-2.5 text-xs text-[#0A0A0A] dark:text-[#F7F7F5] hover:bg-[#F7F7F5] dark:hover:bg-[#262626]">Export JSON</button>
                  </div>
                )}
              </div>
              {role === 'Admin' && (
                <button onClick={resetToMockData} data-testid="reset-data-btn" title="Reset data"
                  className="p-2 text-xs border border-[#E5E5E5] dark:border-[#262626] rounded-md text-[#A3A3A3] hover:bg-[#F7F7F5] dark:hover:bg-[#1A1A1A] transition-colors">
                  <RotateCcw size={13} />
                </button>
              )}
              {role === 'Admin' && (
                <button onClick={() => { setEditingTx(null); setModalOpen(true); }} data-testid="add-transaction-btn"
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-[#0A0A0A] dark:bg-[#F7F7F5] text-white dark:text-[#0A0A0A] rounded-md hover:opacity-90 transition-opacity">
                  <Plus size={13} /> Add
                </button>
              )}
            </div>
          </div>

          {/* Row 2: Search + Type + Category */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A3A3A3]" />
              <input type="text" placeholder="Search by description, merchant, category..."
                value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                data-testid="search-input"
                className="w-full pl-8 pr-4 py-2 text-xs border border-[#E5E5E5] dark:border-[#262626] rounded-md bg-transparent text-[#0A0A0A] dark:text-[#F7F7F5] placeholder-[#A3A3A3] focus:outline-none focus:ring-2 focus:ring-[#0033CC] transition-colors"
              />
            </div>
            <select value={typeFilter} onChange={e => { setTypeFilter(e.target.value); setPage(1); }} data-testid="type-filter"
              className="px-3 py-2 text-xs border border-[#E5E5E5] dark:border-[#262626] rounded-md bg-white dark:bg-[#1A1A1A] text-[#0A0A0A] dark:text-[#F7F7F5] focus:outline-none focus:ring-2 focus:ring-[#0033CC]">
              <option value="All">All Types</option>
              <option value="Income">Income</option>
              <option value="Expense">Expense</option>
            </select>
            <select value={catFilter} onChange={e => { setCatFilter(e.target.value); setPage(1); }} data-testid="category-filter"
              className="px-3 py-2 text-xs border border-[#E5E5E5] dark:border-[#262626] rounded-md bg-white dark:bg-[#1A1A1A] text-[#0A0A0A] dark:text-[#F7F7F5] focus:outline-none focus:ring-2 focus:ring-[#0033CC]">
              {allCats.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          {/* Row 3: Date Range Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border text-xs font-medium transition-colors ${hasDateFilter ? 'border-[#0033CC] bg-blue-50 dark:bg-[#1A2040] text-[#0033CC] dark:text-[#2952CC]' : 'border-[#E5E5E5] dark:border-[#262626] text-[#A3A3A3]'}`}>
              <Calendar size={12} />
              <span>Date Range</span>
            </div>
            <input type="date" value={dateFrom} onChange={e => { setDateFrom(e.target.value); setPage(1); }}
              data-testid="date-from-input" className={dateCls} />
            <span className="text-xs text-[#A3A3A3]">—</span>
            <input type="date" value={dateTo} onChange={e => { setDateTo(e.target.value); setPage(1); }}
              data-testid="date-to-input" className={dateCls} />
            {hasDateFilter && (
              <button
                onClick={() => { setDateFrom(''); setDateTo(''); setPage(1); }}
                data-testid="clear-date-range"
                className="flex items-center gap-1 text-xs text-[#D82C0D] dark:text-[#FF3B30] hover:underline"
              >
                <X size={11} /> Clear
              </button>
            )}
            {(search || typeFilter !== 'All' || catFilter !== 'All' || hasDateFilter) && (
              <button onClick={clearFilters} data-testid="clear-all-filters"
                className="text-xs text-[#525252] dark:text-[#A3A3A3] hover:text-[#0033CC] underline ml-1">
                Clear all filters
              </button>
            )}
          </div>
        </div>

        {/* ── Table ── */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-[#F0F0F0] dark:border-[#1A1A1A]">
                {[
                  { key: 'date',        label: 'Date' },
                  { key: 'description', label: 'Description' },
                  { key: 'category',    label: 'Category' },
                  { key: 'type',        label: 'Type' },
                  { key: 'amount',      label: 'Amount', right: true },
                ].map(({ key, label, right }) => (
                  <th key={key} onClick={() => handleSort(key)}
                    className={`px-5 py-3 text-[10px] text-[#525252] dark:text-[#A3A3A3] tracking-[0.12em] uppercase font-medium cursor-pointer select-none hover:text-[#0A0A0A] dark:hover:text-[#F7F7F5] transition-colors ${right ? 'text-right' : 'text-left'}`}>
                    <div className={`flex items-center gap-1 ${right ? 'justify-end' : ''}`}>
                      {label} <SortIcon col={key} />
                    </div>
                  </th>
                ))}
                {role === 'Admin' && (
                  <th className="px-5 py-3 text-[10px] text-[#525252] dark:text-[#A3A3A3] tracking-[0.12em] uppercase font-medium text-right">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={role === 'Admin' ? 6 : 5} className="px-5 py-16 text-center text-sm text-[#A3A3A3]" data-testid="empty-state">
                    No transactions match your filters
                  </td>
                </tr>
              ) : paginated.map(tx => (
                <tr key={tx.id} data-testid={`transaction-row-${tx.id}`}
                  className="border-b border-[#F7F7F5] dark:border-[#1A1A1A] hover:bg-[#F7F7F5] dark:hover:bg-[#161616] transition-colors">
                  <td className="px-5 py-3.5 text-xs text-[#525252] dark:text-[#A3A3A3] whitespace-nowrap">{fmtDate(tx.date)}</td>
                  <td className="px-5 py-3.5">
                    <p className="text-sm font-medium text-[#0A0A0A] dark:text-[#F7F7F5] leading-tight">{tx.description}</p>
                    {tx.merchant && <p className="text-xs text-[#A3A3A3] leading-tight mt-0.5">{tx.merchant}</p>}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="inline-block px-2 py-0.5 text-[11px] bg-[#F0F0F0] dark:bg-[#262626] text-[#525252] dark:text-[#A3A3A3] rounded-sm whitespace-nowrap">{tx.category}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center px-2 py-0.5 text-[11px] rounded-sm font-medium whitespace-nowrap ${tx.type === 'income' ? 'bg-[#E6F4EF] dark:bg-[#0A2018] text-[#008060] dark:text-[#00E676]' : 'bg-[#FEF0EE] dark:bg-[#2A0A08] text-[#D82C0D] dark:text-[#FF3B30]'}`}>
                      {tx.type === 'income' ? 'Income' : 'Expense'}
                    </span>
                  </td>
                  <td className={`px-5 py-3.5 text-sm font-semibold tabular-nums text-right whitespace-nowrap ${tx.type === 'income' ? 'text-[#008060] dark:text-[#00E676]' : 'text-[#D82C0D] dark:text-[#FF3B30]'}`}>
                    {tx.type === 'income' ? '+' : '-'}${tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  {role === 'Admin' && (
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => { setEditingTx(tx); setModalOpen(true); }} data-testid={`edit-tx-${tx.id}`}
                          className="p-1.5 rounded-md text-[#A3A3A3] hover:text-[#0033CC] hover:bg-blue-50 dark:hover:bg-[#1A2040] transition-colors">
                          <Edit2 size={13} />
                        </button>
                        <button onClick={() => deleteTransaction(tx.id)} data-testid={`delete-tx-${tx.id}`}
                          className="p-1.5 rounded-md text-[#A3A3A3] hover:text-[#D82C0D] hover:bg-[#FEF0EE] dark:hover:bg-[#2A0A08] transition-colors">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <div className="px-5 py-3.5 flex items-center justify-between border-t border-[#E5E5E5] dark:border-[#262626]">
            <p className="text-xs text-[#A3A3A3]">
              {((page - 1) * PAGE_SIZE) + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
            </p>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} data-testid="prev-page-btn"
                className="px-3 py-1.5 text-xs border border-[#E5E5E5] dark:border-[#262626] rounded-md disabled:opacity-30 hover:bg-[#F7F7F5] dark:hover:bg-[#1A1A1A] transition-colors">Prev</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).filter(n => Math.abs(n - page) <= 2).map(n => (
                <button key={n} onClick={() => setPage(n)}
                  className={`w-8 h-8 text-xs rounded-md transition-colors ${n === page ? 'bg-[#0A0A0A] dark:bg-[#F7F7F5] text-white dark:text-[#0A0A0A] font-semibold' : 'border border-[#E5E5E5] dark:border-[#262626] hover:bg-[#F7F7F5] dark:hover:bg-[#1A1A1A] text-[#525252] dark:text-[#A3A3A3]'}`}>
                  {n}
                </button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} data-testid="next-page-btn"
                className="px-3 py-1.5 text-xs border border-[#E5E5E5] dark:border-[#262626] rounded-md disabled:opacity-30 hover:bg-[#F7F7F5] dark:hover:bg-[#1A1A1A] transition-colors">Next</button>
            </div>
          </div>
        )}
      </div>

      {modalOpen && (
        <TransactionModal transaction={editingTx} onClose={() => { setModalOpen(false); setEditingTx(null); }} />
      )}
    </>
  );
}
