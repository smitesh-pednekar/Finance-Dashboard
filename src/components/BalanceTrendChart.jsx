import React, { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { useApp } from '../context/AppContext';

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function getMonthLabel(key) {
  const [, m] = key.split('-');
  return MONTH_NAMES[parseInt(m, 10) - 1];
}

export default function BalanceTrendChart() {
  const { transactions, darkMode } = useApp();

  const { labels, balances, incomeData, expenseData } = useMemo(() => {
    const months = [...new Set(transactions.map(t => t.date.substring(0, 7)))].sort();
    let running = 0;
    const balances = [];
    const incomeData = [];
    const expenseData = [];

    months.forEach(m => {
      const txns = transactions.filter(t => t.date.startsWith(m));
      const inc = txns.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
      const exp = txns.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
      running += inc - exp;
      balances.push(parseFloat(running.toFixed(2)));
      incomeData.push(inc);
      expenseData.push(exp);
    });

    return { labels: months.map(getMonthLabel), balances, incomeData, expenseData };
  }, [transactions]);

  const textColor  = darkMode ? '#A3A3A3' : '#525252';
  const gridColor  = darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)';
  const tooltipBg  = darkMode ? '#1A1A1A' : '#FFFFFF';
  const tooltipTxt = darkMode ? '#F7F7F5' : '#0A0A0A';
  const tooltipBrd = darkMode ? '#262626' : '#E5E5E5';

  const data = {
    labels,
    datasets: [
      {
        label: 'Balance',
        data: balances,
        borderColor: '#0033CC',
        backgroundColor: 'rgba(0,51,204,0.07)',
        tension: 0.35,
        fill: true,
        pointBackgroundColor: '#0033CC',
        pointRadius: 4,
        pointHoverRadius: 6,
        borderWidth: 2.5,
      },
      {
        label: 'Income',
        data: incomeData,
        borderColor: '#008060',
        backgroundColor: 'transparent',
        tension: 0.35,
        fill: false,
        pointBackgroundColor: '#008060',
        pointRadius: 3,
        pointHoverRadius: 5,
        borderWidth: 1.5,
      },
      {
        label: 'Expenses',
        data: expenseData,
        borderColor: '#D82C0D',
        backgroundColor: 'transparent',
        tension: 0.35,
        fill: false,
        pointBackgroundColor: '#D82C0D',
        pointRadius: 3,
        pointHoverRadius: 5,
        borderWidth: 1.5,
      },
    ],
  };

  const options = {
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
        callbacks: {
          label: ctx => ` ${ctx.dataset.label}: $${ctx.parsed.y.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: textColor, font: { size: 11 }, family: 'IBM Plex Sans' },
        border: { display: false },
      },
      y: {
        grid: { color: gridColor },
        ticks: {
          color: textColor,
          font: { size: 11 },
          callback: v => `$${(v / 1000).toFixed(0)}k`,
        },
        border: { display: false },
      },
    },
  };

  return (
    <div className="bg-white dark:bg-[#121212] border border-[#E5E5E5] dark:border-[#262626] rounded-md p-5 md:p-6 h-full animate-fade-up" style={{ animationDelay: '60ms' }} data-testid="balance-trend-chart">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
        <div>
          <p className="text-[10px] text-[#525252] dark:text-[#A3A3A3] tracking-[0.2em] uppercase font-medium">Balance Trend</p>
          <p className="text-xs text-[#A3A3A3] mt-0.5">Cumulative financial position</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          {[
            { color: '#0033CC', label: 'Balance' },
            { color: '#008060', label: 'Income' },
            { color: '#D82C0D', label: 'Expenses' },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <div className="w-4 h-0.5 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-[#525252] dark:text-[#A3A3A3]">{label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="h-56 md:h-64">
        <Line key={darkMode ? 'dark' : 'light'} data={data} options={options} />
      </div>
    </div>
  );
}
