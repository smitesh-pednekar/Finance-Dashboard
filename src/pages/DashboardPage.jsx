import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FileDown, AlertCircle, ArrowRight } from 'lucide-react';
import SummaryCards from '../components/SummaryCards';
import BalanceTrendChart from '../components/BalanceTrendChart';
import SpendingBreakdownChart from '../components/SpendingBreakdownChart';
import RecentTransactions from '../components/RecentTransactions';
import { useApp } from '../context/AppContext';
import { generatePDF } from '../utils/pdfExport';

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function BudgetAlerts() {
  const { transactions, budgets } = useApp();

  const { currentMonth, alerts } = useMemo(() => {
    const months = [...new Set(transactions.map(t => t.date.substring(0, 7)))].sort();
    const currentMonth = months[months.length - 1] || '';
    const alerts = Object.entries(budgets)
      .map(([cat, budget]) => {
        const spent = transactions
          .filter(t => t.type === 'expense' && t.date.startsWith(currentMonth) && t.category === cat)
          .reduce((s, t) => s + t.amount, 0);
        const pct = budget > 0 ? (spent / budget) * 100 : 0;
        return { cat, spent, budget, pct };
      })
      .filter(e => e.pct >= 75)
      .sort((a, b) => b.pct - a.pct)
      .slice(0, 4);
    return { currentMonth, alerts };
  }, [transactions, budgets]);

  if (alerts.length === 0) return null;

  const [y, m] = currentMonth.split('-');
  const label = currentMonth ? `${MONTH_NAMES[parseInt(m, 10) - 1]} ${y}` : '';

  return (
    <div className="bg-white dark:bg-[#121212] border border-[#E5E5E5] dark:border-[#262626] rounded-md p-5 md:p-6 animate-fade-up" style={{ animationDelay: '240ms' }} data-testid="dashboard-budget-alerts">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[10px] text-[#525252] dark:text-[#A3A3A3] tracking-[0.2em] uppercase font-medium">Budget Alerts</p>
          <p className="text-xs text-[#A3A3A3] mt-0.5">{label} — {alerts.length} categories need attention</p>
        </div>
        <Link to="/budgets" className="flex items-center gap-1 text-xs text-[#0033CC] dark:text-[#2952CC] hover:underline font-medium" data-testid="view-budgets-link">
          Manage <ArrowRight size={12} />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {alerts.map(({ cat, spent, budget, pct }) => {
          const isOver = pct >= 100;
          const isNear = pct >= 80;
          return (
            <div
              key={cat}
              className={`p-3.5 rounded-md border ${
                isOver ? 'bg-[#FEF0EE] dark:bg-[#2A0A08] border-[#D82C0D]/20' :
                isNear ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800' :
                'bg-[#E6F4EF] dark:bg-[#0A2018] border-[#008060]/20'
              }`}
              data-testid={`alert-card-${cat.replace(/[\s&]/g, '-').toLowerCase()}`}
            >
              <div className="flex items-center gap-1.5 mb-2">
                <AlertCircle size={13} className={isOver ? 'text-[#D82C0D] dark:text-[#FF3B30]' : isNear ? 'text-amber-500' : 'text-[#008060] dark:text-[#00E676]'} />
                <p className="text-[10px] text-[#525252] dark:text-[#A3A3A3] uppercase tracking-wide font-medium truncate">{cat}</p>
              </div>
              <p className={`text-lg font-bold tabular-nums ${isOver ? 'text-[#D82C0D] dark:text-[#FF3B30]' : isNear ? 'text-amber-500' : 'text-[#008060] dark:text-[#00E676]'}`} style={{ fontFamily: 'Cabinet Grotesk, sans-serif' }}>
                {pct.toFixed(0)}%
              </p>
              <p className="text-[10px] text-[#A3A3A3] mt-0.5">
                ${spent.toLocaleString('en-US', { maximumFractionDigits: 0 })} / ${budget.toLocaleString('en-US', { maximumFractionDigits: 0 })}
              </p>
              {/* Mini progress bar */}
              <div className="h-1 w-full bg-white/60 dark:bg-black/30 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.min(pct, 100)}%`,
                    backgroundColor: isOver ? '#D82C0D' : isNear ? '#F59E0B' : '#008060',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { role, transactions, budgets } = useApp();

  const handleExportPDF = () => generatePDF(transactions, budgets);

  return (
    <div className="space-y-6 animate-fade-up" data-testid="dashboard-page">
      {/* Page Title */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10px] text-[#525252] dark:text-[#A3A3A3] tracking-[0.2em] uppercase font-medium">Overview</p>
          <h1
            className="text-3xl md:text-4xl font-bold text-[#0A0A0A] dark:text-[#F7F7F5] mt-1 tracking-tight"
            style={{ fontFamily: 'Cabinet Grotesk, sans-serif' }}
          >
            Financial Dashboard
          </h1>
          <p className="text-sm text-[#525252] dark:text-[#A3A3A3] mt-1">
            January – June 2025 &bull; Viewing as <span className="font-semibold text-[#0A0A0A] dark:text-[#F7F7F5]">{role}</span>
          </p>
        </div>
        <button
          onClick={handleExportPDF}
          data-testid="export-pdf-btn"
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold bg-[#0033CC] hover:bg-[#0029a8] text-white rounded-md transition-colors"
        >
          <FileDown size={15} /> Export PDF
        </button>
      </div>

      {/* KPI Cards */}
      <SummaryCards />

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2"><BalanceTrendChart /></div>
        <div className="lg:col-span-1"><SpendingBreakdownChart /></div>
      </div>

      {/* Budget Alerts */}
      <BudgetAlerts />

      {/* Recent Transactions */}
      <RecentTransactions />
    </div>
  );
}
