'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AppProvider, useApp } from '@/lib/app-context';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { LayoutDashboard, Layers, Briefcase, ShieldAlert } from 'lucide-react';
import { useEffect } from 'react';

function DashboardLayoutInner({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, setIsCreateModalOpen } = useApp();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn) return null;

  const mobileNavItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/projects/q-core-migration', label: 'Board', icon: Layers },
    { href: '/manager', label: 'Workload', icon: Briefcase },
    { href: '/executive', label: 'Admin', icon: ShieldAlert },
  ];

  return (
    <div className="min-h-screen bg-editorial-cream text-stone-900 font-sans">
      <Sidebar />

      <div className="ml-0 lg:ml-64 flex flex-col min-h-screen relative pb-16 lg:pb-0">
        <Header />

        <main className="p-4 md:p-8 max-w-[1440px] mx-auto w-full flex-grow">
          {children}
        </main>
      </div>

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-stone-50 h-14 border-t border-stone-200 flex items-center justify-around z-50 px-2 shadow-lg">
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center text-[10px] font-bold gap-0.5 ${
                isActive ? 'text-editorial-wine' : 'text-stone-550'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}

        <div className="relative -top-3">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="w-11 h-11 bg-editorial-wine text-white rounded-md border border-stone-950/25 flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>
        </div>
      </nav>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <DashboardLayoutInner>{children}</DashboardLayoutInner>
    </AppProvider>
  );
}
