'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Layers, Briefcase, ShieldAlert, LogOut, Plus } from 'lucide-react';
import { useApp } from '@/lib/app-context';

export default function Sidebar() {
  const pathname = usePathname();
  const { currentPersona, handleChangePersona, handleLogout, setIsCreateModalOpen } = useApp();

  const navItems = [
    { href: '/dashboard', label: 'Global Overview', icon: LayoutDashboard },
    { href: '/projects/q-core-migration', label: 'Quantum Migration Detail', icon: Layers },
    { href: '/manager', label: 'Team Workloads', icon: Briefcase },
    { href: '/executive', label: 'Exec Suite / Admin', icon: ShieldAlert },
  ];

  return (
    <aside className="hidden lg:flex flex-col h-screen w-64 fixed left-0 top-0 bg-editorial-cream border-r border-stone-200 py-6 px-4 z-40 text-stone-900 font-sans">
      <div className="mb-8 px-2">
        <div className="flex items-center gap-2 mb-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-editorial-wine">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9s2.015-9 4.5-9m0 18c-4.97 0-9-4.03-9-9s4.03-9 9-9c4.97 0 9 4.03 9 9s-4.03 9-9 9Z" />
          </svg>
          <h1 className="text-lg font-serif font-bold text-stone-900 tracking-tight">Employee Hub</h1>
        </div>
        <p className="text-[9px] font-bold text-stone-500 uppercase tracking-widest leading-none">Workforce Terminal</p>
        <div className="w-full h-[1px] bg-stone-200 mt-4"></div>
      </div>

      <nav className="flex-grow space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`w-full flex items-center gap-3 px-3 py-2.5 transition-all text-xs font-medium border-l-2 ${
                isActive
                  ? 'bg-white text-stone-900 border-editorial-wine font-bold shadow-sm'
                  : 'border-transparent text-stone-600 hover:bg-stone-100 hover:text-stone-900'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-editorial-wine' : 'text-stone-400'}`} />
              <span className="tracking-wide">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-stone-200/60 space-y-3">
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="w-full flex items-center justify-center gap-2 bg-editorial-wine hover:bg-stone-900 text-white py-2.5 px-4 rounded-md font-bold transition-all text-xs tracking-wider uppercase border border-stone-950/10"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Project</span>
        </button>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 text-stone-500 hover:text-red-700 transition-colors rounded-md text-xs font-medium"
        >
          <LogOut className="w-3.5 h-3.5 text-stone-400" />
          <span>Logout</span>
        </button>

        <div className="mt-4 p-3 bg-white border border-stone-200 rounded-md flex items-center gap-2.5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div className="relative">
            <img alt={currentPersona.name} className="w-8 h-8 rounded-full border border-stone-200" referrerPolicy="no-referrer" src={currentPersona.avatarUrl} />
            {currentPersona.checkedIn && (
              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-600 rounded-full border border-white animate-pulse"></span>
            )}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-stone-900 truncate leading-tight">{currentPersona.name}</p>
            <p className="text-[9px] text-stone-500 font-semibold truncate uppercase tracking-wider font-sans mt-0.5">{currentPersona.title}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
