import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Wallet, TrendingUp, TrendingDown, PiggyBank, ArrowUpRight, ArrowDownRight } from 'lucide-react';

function StatCard({ label, value, sub, subPositive, icon: Icon, iconBg, iconColor, delay, testId }) {
  return (
    <div
      data-testid={testId}
      className="bg-white dark:bg-[#121212] border border-[#E5E5E5] dark:border-[#262626] rounded-md p-5 hover:shadow-md transition-all duration-200 animate-fade-up"
      style={{ animationDelay: delay }}
    >
      <div className="flex items-start justify-between mb-3">
        <p className="text-[10px] text-[#525252] dark:text-[#A3A3A3] tracking-[0.2em] uppercase font-medium">{label}</p>
        <div className={`w-9 h-9 ${iconBg} rounded-md flex items-center justify-center shrink-0`}>
          <Icon size={16} className={iconColor} />
        </div>
      </div>
      <p
        className="text-3xl font-bold text-[#0A0A0A] dark:text-[#F7F7F5] tabular-nums tracking-tight"
        style={{ fontFamily: 'Cabinet Grotesk, sans-serif' }}
      >
        {value}
      </p>
      <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${subPositive ? 'text-[#008060] dark:text-[#00E676]' : 'text-[#D82C0D] dark:text-[#FF3B30]'}`}>
        {subPositive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
        <span>{sub}</span>
      </div>
    </div>
  );
}

export default function SummaryCards() {
  const { transactions } = useApp();

  const stats = useMemo(() => {
    const income   = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    const balance  = income - expenses;
    const savings  = income > 0 ? (balance / income) * 100 : 0;
    return { income, expenses, balance, savings };
  }, [transactions]);

  const fmt = (n) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <StatCard
        testId="total-balance-card"
        label="Total Balance"
        value={fmt(stats.balance)}
        sub="+12.5% vs prior period"
        subPositive={true}
        icon={Wallet}
        iconBg="bg-blue-50 dark:bg-[#1A2040]"
        iconColor="text-[#0033CC] dark:text-[#2952CC]"
        delay="0ms"
      />
      <StatCard
        testId="total-income-card"
        label="Total Income"
        value={fmt(stats.income)}
        sub="+8.2% vs prior period"
        subPositive={true}
        icon={TrendingUp}
        iconBg="bg-[#E6F4EF] dark:bg-[#0A2018]"
        iconColor="text-[#008060] dark:text-[#00E676]"
        delay="60ms"
      />
      <StatCard
        testId="total-expenses-card"
        label="Total Expenses"
        value={fmt(stats.expenses)}
        sub="+4.1% vs prior period"
        subPositive={false}
        icon={TrendingDown}
        iconBg="bg-[#FEF0EE] dark:bg-[#2A0A08]"
        iconColor="text-[#D82C0D] dark:text-[#FF3B30]"
        delay="120ms"
      />
      <StatCard
        testId="savings-rate-card"
        label="Savings Rate"
        value={`${stats.savings.toFixed(1)}%`}
        sub="+2.3% vs prior period"
        subPositive={true}
        icon={PiggyBank}
        iconBg="bg-blue-50 dark:bg-[#1A2040]"
        iconColor="text-[#0033CC] dark:text-[#2952CC]"
        delay="180ms"
      />
    </div>
  );
}
