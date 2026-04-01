import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function RecentTransactions() {
  const { transactions } = useApp();

  const recent = useMemo(() => {
    return [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6);
  }, [transactions]);

  const fmtDate = d => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <div className="bg-white dark:bg-[#121212] border border-[#E5E5E5] dark:border-[#262626] rounded-md p-5 md:p-6 animate-fade-up" style={{ animationDelay: '180ms' }} data-testid="recent-transactions">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[10px] text-[#525252] dark:text-[#A3A3A3] tracking-[0.2em] uppercase font-medium">Recent Transactions</p>
        <Link
          to="/transactions"
          className="flex items-center gap-1 text-xs text-[#0033CC] dark:text-[#2952CC] hover:underline font-medium"
          data-testid="view-all-transactions-link"
        >
          View all <ArrowRight size={12} />
        </Link>
      </div>

      <div className="space-y-1">
        {recent.map(tx => (
          <div key={tx.id} className="flex items-center justify-between py-2.5 border-b border-[#F7F7F5] dark:border-[#1A1A1A] last:border-0" data-testid={`recent-tx-${tx.id}`}>
            <div className="flex items-center gap-3 min-w-0">
              <div className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 text-xs font-bold ${
                tx.type === 'income'
                  ? 'bg-[#E6F4EF] dark:bg-[#0A2018] text-[#008060] dark:text-[#00E676]'
                  : 'bg-[#FEF0EE] dark:bg-[#2A0A08] text-[#D82C0D] dark:text-[#FF3B30]'
              }`}>
                {tx.type === 'income' ? '+' : '-'}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-[#0A0A0A] dark:text-[#F7F7F5] truncate">{tx.description}</p>
                <p className="text-xs text-[#A3A3A3]">{tx.category} &bull; {fmtDate(tx.date)}</p>
              </div>
            </div>
            <span className={`text-sm font-semibold tabular-nums shrink-0 ml-4 ${
              tx.type === 'income' ? 'text-[#008060] dark:text-[#00E676]' : 'text-[#D82C0D] dark:text-[#FF3B30]'
            }`}>
              {tx.type === 'income' ? '+' : '-'}${tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
