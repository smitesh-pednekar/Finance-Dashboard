import React from 'react';
import TransactionsTable from '../components/TransactionsTable';
import { useApp } from '../context/AppContext';

export default function TransactionsPage() {
  const { role } = useApp();

  return (
    <div className="space-y-6 animate-fade-up" data-testid="transactions-page">
      <div>
        <p className="text-[10px] text-[#525252] dark:text-[#A3A3A3] tracking-[0.2em] uppercase font-medium">Data</p>
        <h1
          className="text-3xl md:text-4xl font-bold text-[#0A0A0A] dark:text-[#F7F7F5] mt-1 tracking-tight"
          style={{ fontFamily: 'Cabinet Grotesk, sans-serif' }}
        >
          Transactions
        </h1>
        <p className="text-sm text-[#525252] dark:text-[#A3A3A3] mt-1">
          All financial activity &bull;{' '}
          {role === 'Admin'
            ? <span className="text-[#0033CC] dark:text-[#2952CC] font-medium">Admin: can add, edit & delete</span>
            : <span className="text-[#525252] dark:text-[#A3A3A3]">Viewer: read-only mode</span>
          }
        </p>
      </div>
      <TransactionsTable />
    </div>
  );
}
