import React from 'react';
import InsightsPanel from '../components/InsightsPanel';

export default function InsightsPage() {
  return (
    <div className="space-y-6 animate-fade-up" data-testid="insights-page">
      <div>
        <p className="text-[10px] text-[#525252] dark:text-[#A3A3A3] tracking-[0.2em] uppercase font-medium">Analysis</p>
        <h1
          className="text-3xl md:text-4xl font-bold text-[#0A0A0A] dark:text-[#F7F7F5] mt-1 tracking-tight"
          style={{ fontFamily: 'Cabinet Grotesk, sans-serif' }}
        >
          Insights
        </h1>
        <p className="text-sm text-[#525252] dark:text-[#A3A3A3] mt-1">Spending patterns, trends & smart observations</p>
      </div>
      <InsightsPanel />
    </div>
  );
}
