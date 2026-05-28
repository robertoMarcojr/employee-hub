'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { LayoutDashboard, KanbanSquare, FolderKanban, User, LogOut, Shield } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/lib/store/hooks';
import { logout } from '@/lib/store/authSlice';
import Spinner from '@/components/Spinner';

const navItems = [
  { href: '/employee', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/employee/tokens', label: 'My Tokens', icon: KanbanSquare },
  { href: '/employee/projects', label: 'My Projects', icon: FolderKanban },
  { href: '/employee/profile', label: 'Profile', icon: User },
];

export default function EmployeeLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector(s => s.auth.isLoggedIn);
  const user = useAppSelector(s => s.auth.user);
  const globalLoading = useAppSelector(s => s.ui.globalLoading);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-editorial-cream flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-editorial-cream text-stone-900 font-sans">
      {globalLoading && (
        <div className="fixed inset-0 bg-stone-900/10 z-[100] flex items-center justify-center">
          <Spinner />
        </div>
      )}

      <aside className="hidden lg:flex flex-col h-screen w-64 fixed left-0 top-0 bg-editorial-cream border-r border-stone-200 py-6 px-4 z-40">
        <div className="mb-8 px-2">
          <div className="flex items-center gap-2 mb-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-editorial-wine">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9s2.015-9 4.5-9m0 18c-4.97 0-9-4.03-9-9s4.03-9 9-9c4.97 0 9 4.03 9 9s-4.03 9-9 9Z" />
            </svg>
            <h1 className="text-lg font-serif font-bold text-stone-900 tracking-tight">Employee Hub</h1>
          </div>
          <p className="text-[9px] font-bold text-stone-500 uppercase tracking-widest leading-none">Employee Portal</p>
          <div className="w-full h-[1px] bg-stone-200 mt-4"></div>
        </div>

        <div className="flex-grow">
          <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest px-3 mb-1">Workspace</p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
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
        </div>

        <div className="mt-auto pt-6 border-t border-stone-200/60 space-y-3">
          <button
            onClick={() => { navigator.sendBeacon('/api/auth/logout', '{}'); dispatch(logout()); window.location.href = '/login'; }}
            className="w-full flex items-center gap-3 px-3 py-2 text-stone-500 hover:text-red-700 transition-colors rounded-md text-xs font-medium cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 text-stone-400" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <div className="ml-0 lg:ml-64 flex flex-col min-h-screen relative pb-16 lg:pb-0">
        <main className="p-4 md:p-8 max-w-[1440px] mx-auto w-full flex-grow">
          {children}
        </main>
      </div>

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-stone-50 h-14 border-t border-stone-200 flex items-center justify-around z-50 px-2 shadow-lg">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center text-[10px] font-bold gap-0.5 ${
                isActive ? 'text-editorial-wine' : 'text-stone-500'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
