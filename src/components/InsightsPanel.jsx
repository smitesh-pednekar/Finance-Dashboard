import React, { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import { useApp } from '../context/AppContext';
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle, Target } from 'lucide-react';

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const PALETTE = ['#D82C0D','#0033CC','#008060','#525252','#F59E0B','#8B5CF6','#EC4899','#14B8A6','#0EA5E9','#84CC16','#F97316'];

export default function InsightsPanel() {
  const { transactions, darkMode } = useApp();

  const data = useMemo(() => {
    const months = [...new Set(transactions.map(t => t.date.substring(0, 7)))].sort();

    const monthlyStats = months.map(m => {
      const txns = transactions.filter(t => t.date.startsWith(m));
      const income  = txns.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
      const expense = txns.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
      return { label: MONTH_NAMES[parseInt(m.split('-')[1], 10) - 1], income, expense, net: income - expense };
    });

    // Category totals (expenses only)
    const catMap = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
      catMap[t.category] = (catMap[t.category] || 0) + t.amount;
    });
    const sortedCats = Object.entries(catMap).sort((a, b) => b[1] - a[1]);
    const totalExpense = sortedCats.reduce((s, [, v]) => s + v, 0);
    const totalIncome  = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);

    // MoM comparison (last 2 months)
    const last  = monthlyStats[monthlyStats.length - 1];
    const prev  = monthlyStats[monthlyStats.length - 2] || { income: 0, expense: 0, net: 0 };
    const expChange = prev.expense > 0 ? ((last.expense - prev.expense) / prev.expense * 100) : 0;

    const avgSavings = monthlyStats.filter(m => m.income > 0).reduce((s, m) => s + (m.net / m.income) * 100, 0)
      / (monthlyStats.filter(m => m.income > 0).length || 1);

    return { monthlyStats, sortedCats, totalExpense, totalIncome, last, prev, expChange, avgSavings };
  }, [transactions]);

  const textColor  = darkMode ? '#A3A3A3' : '#525252';
  const gridColor  = darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)';
  const tooltipBg  = darkMode ? '#1A1A1A' : '#FFFFFF';
  const tooltipTxt = darkMode ? '#F7F7F5' : '#0A0A0A';
  const tooltipBrd = darkMode ? '#262626' : '#E5E5E5';

  const barData = {
    labels: data.monthlyStats.map(m => m.label),
    datasets: [
      {
        label: 'Income',
        data: data.monthlyStats.map(m => m.income),
        backgroundColor: '#008060',
        borderRadius: 3,
        barPercentage: 0.55,
      },
      {
        label: 'Expenses',
        data: data.monthlyStats.map(m => m.expense),
        backgroundColor: '#D82C0D',
        borderRadius: 3,
        barPercentage: 0.55,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: tooltipBg,
        titleColor: tooltipTxt,
        bodyColor: tooltipTxt,
        borderColor: tooltipBrd,
        borderWidth: 1,
        padding: 10,
        callbacks: { label: ctx => ` ${ctx.dataset.label}: $${ctx.parsed.y.toLocaleString('en-US', { minimumFractionDigits: 0 })}` },
      },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: textColor, font: { size: 11 } }, border: { display: false } },
      y: { grid: { color: gridColor }, ticks: { color: textColor, font: { size: 11 }, callback: v => `$${(v/1000).toFixed(0)}k` }, border: { display: false } },
    },
  };

  const expUp = data.expChange > 0;

  return (
    <div className="space-y-6" data-testid="insights-panel">

      {/* Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#121212] border border-[#E5E5E5] dark:border-[#262626] rounded-md p-5 animate-fade-up" data-testid="top-category-card">
          <p className="text-[10px] text-[#525252] dark:text-[#A3A3A3] tracking-[0.2em] uppercase font-medium mb-2">Top Spending</p>
          <p className="text-2xl font-bold text-[#D82C0D] dark:text-[#FF3B30] leading-tight" style={{ fontFamily: 'Cabinet Grotesk, sans-serif' }}>
            {data.sortedCats[0]?.[0] || 'N/A'}
          </p>
          <p className="text-xs text-[#A3A3A3] mt-1">
            ${data.sortedCats[0]?.[1]?.toLocaleString('en-US', { maximumFractionDigits: 0 })} &bull;{' '}
            {data.totalExpense > 0 ? ((data.sortedCats[0]?.[1] / data.totalExpense) * 100).toFixed(1) : 0}% of expenses
          </p>
        </div>

        <div className="bg-white dark:bg-[#121212] border border-[#E5E5E5] dark:border-[#262626] rounded-md p-5 animate-fade-up" style={{ animationDelay: '60ms' }} data-testid="monthly-change-card">
          <p className="text-[10px] text-[#525252] dark:text-[#A3A3A3] tracking-[0.2em] uppercase font-medium mb-2">Monthly Change</p>
          <div className="flex items-center gap-2">
            {expUp
              ? <TrendingUp size={18} className="text-[#D82C0D] dark:text-[#FF3B30] shrink-0" />
              : <TrendingDown size={18} className="text-[#008060] dark:text-[#00E676] shrink-0" />
            }
            <p className={`text-2xl font-bold leading-tight ${expUp ? 'text-[#D82C0D] dark:text-[#FF3B30]' : 'text-[#008060] dark:text-[#00E676]'}`} style={{ fontFamily: 'Cabinet Grotesk, sans-serif' }}>
              {expUp ? '+' : ''}{data.expChange.toFixed(1)}%
            </p>
          </div>
          <p className="text-xs text-[#A3A3A3] mt-1">Expenses vs prior month</p>
        </div>

        <div className="bg-white dark:bg-[#121212] border border-[#E5E5E5] dark:border-[#262626] rounded-md p-5 animate-fade-up" style={{ animationDelay: '120ms' }} data-testid="avg-savings-card">
          <p className="text-[10px] text-[#525252] dark:text-[#A3A3A3] tracking-[0.2em] uppercase font-medium mb-2">Avg Savings Rate</p>
          <p className="text-2xl font-bold text-[#0033CC] dark:text-[#2952CC] leading-tight" style={{ fontFamily: 'Cabinet Grotesk, sans-serif' }}>
            {data.avgSavings.toFixed(1)}%
          </p>
          <p className="text-xs text-[#A3A3A3] mt-1">{data.monthlyStats.length}-month average</p>
        </div>
      </div>

      {/* Monthly Comparison Chart */}
      <div className="bg-white dark:bg-[#121212] border border-[#E5E5E5] dark:border-[#262626] rounded-md p-5 md:p-6 animate-fade-up" style={{ animationDelay: '60ms' }} data-testid="monthly-comparison-chart">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <p className="text-[10px] text-[#525252] dark:text-[#A3A3A3] tracking-[0.2em] uppercase font-medium">Monthly Income vs Expenses</p>
          <div className="flex items-center gap-4">
            {[{ color: '#008060', label: 'Income' }, { color: '#D82C0D', label: 'Expenses' }].map(({ color, label }) => (
              <div key={label} className="flex items-center gap-1.5 text-xs">
                <div className="w-3 h-2.5 rounded-sm" style={{ backgroundColor: color }} />
                <span className="text-[#525252] dark:text-[#A3A3A3]">{label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="h-56 md:h-64">
          <Bar key={darkMode ? 'dark' : 'light'} data={barData} options={barOptions} />
        </div>
      </div>

      {/* Category Table */}
      <div className="bg-white dark:bg-[#121212] border border-[#E5E5E5] dark:border-[#262626] rounded-md p-5 md:p-6 animate-fade-up" data-testid="category-breakdown-table">
        <p className="text-[10px] text-[#525252] dark:text-[#A3A3A3] tracking-[0.2em] uppercase font-medium mb-4">Spending by Category</p>
        <div className="space-y-2.5">
          {data.sortedCats.map(([cat, val], i) => (
            <div key={cat} className="flex items-center gap-3">
              <span className="text-xs text-[#525252] dark:text-[#A3A3A3] w-32 truncate shrink-0">{cat}</span>
              <div className="flex-1 h-1.5 bg-[#F0F0F0] dark:bg-[#262626] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${(val / data.totalExpense) * 100}%`, backgroundColor: PALETTE[i % PALETTE.length] }}
                />
              </div>
              <span className="text-xs tabular-nums font-medium text-[#0A0A0A] dark:text-[#F7F7F5] w-20 text-right shrink-0">
                ${val.toLocaleString('en-US', { maximumFractionDigits: 0 })}
              </span>
              <span className="text-xs text-[#A3A3A3] w-10 text-right shrink-0">
                {((val / data.totalExpense) * 100).toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Smart Observations */}
      <div className="bg-white dark:bg-[#121212] border border-[#E5E5E5] dark:border-[#262626] rounded-md p-5 md:p-6 animate-fade-up" data-testid="observations-panel">
        <p className="text-[10px] text-[#525252] dark:text-[#A3A3A3] tracking-[0.2em] uppercase font-medium mb-4">Smart Observations</p>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3.5 bg-[#E6F4EF] dark:bg-[#0A2018] rounded-md">
            <CheckCircle size={15} className="text-[#008060] dark:text-[#00E676] mt-0.5 shrink-0" />
            <p className="text-sm text-[#0A0A0A] dark:text-[#F7F7F5]">
              Average savings rate of <strong>{data.avgSavings.toFixed(1)}%</strong> is {data.avgSavings >= 20 ? 'excellent — well above the recommended 20% threshold.' : 'below the recommended 20%. Consider reviewing discretionary spending.'}
            </p>
          </div>
          <div className="flex items-start gap-3 p-3.5 bg-[#FEF0EE] dark:bg-[#2A0A08] rounded-md">
            <AlertCircle size={15} className="text-[#D82C0D] dark:text-[#FF3B30] mt-0.5 shrink-0" />
            <p className="text-sm text-[#0A0A0A] dark:text-[#F7F7F5]">
              <strong>{data.sortedCats[0]?.[0]}</strong> is your highest expense category at{' '}
              <strong>{data.totalExpense > 0 ? ((data.sortedCats[0]?.[1] / data.totalExpense) * 100).toFixed(1) : 0}%</strong> of total spending.
            </p>
          </div>
          <div className="flex items-start gap-3 p-3.5 bg-blue-50 dark:bg-[#1A2040] rounded-md">
            <Target size={15} className="text-[#0033CC] dark:text-[#2952CC] mt-0.5 shrink-0" />
            <p className="text-sm text-[#0A0A0A] dark:text-[#F7F7F5]">
              Monthly expenses {expUp ? `increased by ${data.expChange.toFixed(1)}% vs last month.` : `decreased by ${Math.abs(data.expChange).toFixed(1)}% vs last month.`}{' '}
              {expUp && data.expChange > 10 ? 'This is a significant rise — monitor closely.' : 'Financial discipline is tracking well.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
