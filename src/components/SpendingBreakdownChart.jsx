import React, { useMemo } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { useApp } from '../context/AppContext';

const PALETTE = [
  '#0033CC','#D82C0D','#008060','#525252','#F59E0B',
  '#8B5CF6','#EC4899','#14B8A6','#0EA5E9','#84CC16','#F97316',
];

export default function SpendingBreakdownChart() {
  const { transactions, darkMode } = useApp();

  const { categoryData, total } = useMemo(() => {
    const map = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
      map[t.category] = (map[t.category] || 0) + t.amount;
    });
    const sorted = Object.entries(map).sort((a, b) => b[1] - a[1]);
    const total = sorted.reduce((s, [, v]) => s + v, 0);
    return { categoryData: sorted, total };
  }, [transactions]);

  const tooltipBg  = darkMode ? '#1A1A1A' : '#FFFFFF';
  const tooltipTxt = darkMode ? '#F7F7F5' : '#0A0A0A';
  const tooltipBrd = darkMode ? '#262626' : '#E5E5E5';

  const data = {
    labels: categoryData.map(([cat]) => cat),
    datasets: [{
      data: categoryData.map(([, v]) => v),
      backgroundColor: PALETTE.slice(0, categoryData.length),
      borderWidth: 0,
      hoverOffset: 6,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '72%',
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
          label: ctx => ` $${ctx.parsed.toLocaleString('en-US', { maximumFractionDigits: 0 })} (${((ctx.parsed / total) * 100).toFixed(1)}%)`,
        },
      },
    },
  };

  return (
    <div className="bg-white dark:bg-[#121212] border border-[#E5E5E5] dark:border-[#262626] rounded-md p-5 md:p-6 h-full animate-fade-up" style={{ animationDelay: '120ms' }} data-testid="spending-breakdown-chart">
      <p className="text-[10px] text-[#525252] dark:text-[#A3A3A3] tracking-[0.2em] uppercase font-medium mb-4">Spending Breakdown</p>

      {/* Doughnut */}
      <div className="relative h-44 mb-5">
        <Doughnut key={darkMode ? 'dark' : 'light'} data={data} options={options} />
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <p className="text-[10px] text-[#A3A3A3] uppercase tracking-wide">Total</p>
          <p
            className="text-xl font-bold text-[#0A0A0A] dark:text-[#F7F7F5] tabular-nums"
            style={{ fontFamily: 'Cabinet Grotesk, sans-serif' }}
          >
            ${total.toLocaleString('en-US', { maximumFractionDigits: 0 })}
          </p>
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-2">
        {categoryData.slice(0, 6).map(([cat, val], i) => (
          <div key={cat} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-sm shrink-0" style={{ backgroundColor: PALETTE[i] }} />
            <span className="text-xs text-[#525252] dark:text-[#A3A3A3] flex-1 truncate">{cat}</span>
            <div className="flex items-center gap-2">
              <div className="w-14 h-1 bg-[#F0F0F0] dark:bg-[#262626] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${(val / total) * 100}%`, backgroundColor: PALETTE[i] }}
                />
              </div>
              <span className="text-xs tabular-nums font-medium text-[#0A0A0A] dark:text-[#F7F7F5] w-14 text-right">
                ${val.toLocaleString('en-US', { maximumFractionDigits: 0 })}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
