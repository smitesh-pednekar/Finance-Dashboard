import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ArrowLeftRight, Lightbulb, X, Target } from 'lucide-react';
import BrandLogo from './BrandLogo';

const navItems = [
  { path: '/',             icon: LayoutDashboard, label: 'Dashboard',    testId: 'nav-dashboard' },
  { path: '/transactions', icon: ArrowLeftRight,  label: 'Transactions', testId: 'nav-transactions' },
  { path: '/insights',     icon: Lightbulb,       label: 'Insights',     testId: 'nav-insights' },
  { path: '/budgets',      icon: Target,          label: 'Budgets',      testId: 'nav-budgets' },
];

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation();

  return (
    <>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          data-testid="sidebar-backdrop"
        />
      )}

      <aside
        data-testid="sidebar"
        className={[
          'fixed lg:static inset-y-0 left-0 z-30',
          'w-64 shrink-0 flex flex-col',
          'bg-white dark:bg-[#121212]',
          'border-r border-[#E5E5E5] dark:border-[#262626]',
          'transition-transform duration-300 ease-in-out',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        ].join(' ')}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-[#E5E5E5] dark:border-[#262626] shrink-0">
          <BrandLogo />
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded-md hover:bg-[#F7F7F5] dark:hover:bg-[#262626] transition-colors"
          >
            <X size={16} className="text-[#525252] dark:text-[#A3A3A3]" />
          </button>
        </div>

        {/* Nav Section Label */}
        <div className="px-6 pt-6 pb-2">
          <p className="text-[10px] text-[#A3A3A3] tracking-[0.2em] uppercase font-medium">Navigation</p>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-3 space-y-0.5">
          {navItems.map(({ path, icon: Icon, label, testId }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                onClick={() => setSidebarOpen(false)}
                data-testid={testId}
                className={[
                  'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-150',
                  isActive
                    ? 'bg-[#0A0A0A] dark:bg-[#F7F7F5] text-white dark:text-[#0A0A0A]'
                    : 'text-[#525252] dark:text-[#A3A3A3] hover:bg-[#F7F7F5] dark:hover:bg-[#1A1A1A] hover:text-[#0A0A0A] dark:hover:text-[#F7F7F5]',
                ].join(' ')}
              >
                <Icon size={17} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 mx-3 mb-4 bg-[#F7F7F5] dark:bg-[#1A1A1A] rounded-md border border-[#E5E5E5] dark:border-[#262626]">
          <p className="text-xs font-medium text-[#0A0A0A] dark:text-[#F7F7F5]">Jan – Jun 2025</p>
          <p className="text-[10px] text-[#A3A3A3] mt-0.5">60 transactions loaded</p>
        </div>
      </aside>
    </>
  );
}
