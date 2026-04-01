import React from 'react';
import { useApp } from '../context/AppContext';
import { Sun, Moon, Menu, Bell, ChevronDown } from 'lucide-react';
import BrandLogo from './BrandLogo';

export default function Header({ setSidebarOpen }) {
  const { darkMode, setDarkMode, role, setRole } = useApp();

  return (
    <header className="h-16 shrink-0 border-b border-[#E5E5E5] dark:border-[#262626] bg-white dark:bg-[#121212] flex items-center justify-between px-4 md:px-6 transition-colors duration-300 z-10">
      {/* Left */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen(prev => !prev)}
          className="lg:hidden p-2 rounded-md hover:bg-[#F7F7F5] dark:hover:bg-[#262626] transition-colors"
          data-testid="mobile-menu-btn"
          aria-label="Open menu"
        >
          <Menu size={20} className="text-[#0A0A0A] dark:text-[#F7F7F5]" />
        </button>
        {/* Mobile Logo */}
        <div className="flex items-center gap-2 lg:hidden">
          <BrandLogo showTagline={false} />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Role Switcher */}
        <div className="relative">
          <select
            value={role}
            onChange={e => setRole(e.target.value)}
            data-testid="role-switcher"
            className="appearance-none pl-3 pr-8 py-1.5 text-xs font-medium border border-[#E5E5E5] dark:border-[#262626] bg-white dark:bg-[#1A1A1A] text-[#0A0A0A] dark:text-[#F7F7F5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0033CC] cursor-pointer transition-colors"
          >
            <option value="Admin">Admin</option>
            <option value="Viewer">Viewer</option>
          </select>
          <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#A3A3A3] pointer-events-none" />
        </div>

        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          data-testid="dark-mode-toggle"
          className="p-2 rounded-md hover:bg-[#F7F7F5] dark:hover:bg-[#262626] transition-colors"
          aria-label="Toggle dark mode"
        >
          {darkMode
            ? <Sun size={16} className="text-[#F7F7F5]" />
            : <Moon size={16} className="text-[#525252]" />
          }
        </button>

        {/* Notification Bell */}
        <button
          className="p-2 rounded-md hover:bg-[#F7F7F5] dark:hover:bg-[#262626] transition-colors relative"
          data-testid="notifications-btn"
          aria-label="Notifications"
        >
          <Bell size={16} className="text-[#525252] dark:text-[#A3A3A3]" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#D82C0D] rounded-full"></span>
        </button>

        {/* User Avatar */}
        <div className="flex items-center gap-2 pl-1 border-l border-[#E5E5E5] dark:border-[#262626]">
          <div className="w-8 h-8 rounded-full bg-[#0033CC] flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-semibold">JD</span>
          </div>
          <div className="hidden md:block">
            <p className="text-xs font-semibold text-[#0A0A0A] dark:text-[#F7F7F5] leading-tight">John Doe</p>
            <p className="text-xs text-[#A3A3A3] leading-tight">{role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
