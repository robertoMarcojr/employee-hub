'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import { Users, Tags } from 'lucide-react';
import { useAppSelector } from '@/lib/store/hooks';
import Spinner from '@/components/Spinner';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoggedIn = useAppSelector(s => s.auth.isLoggedIn);
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

  const mobileNavItems = [
    { href: '/admin/users', label: 'Employees', icon: Users },
    { href: '/admin/tags', label: 'Tags', icon: Tags },
  ];

  return (
    <div className="min-h-screen bg-editorial-cream text-stone-900 font-sans">
      {globalLoading && (
        <div className="fixed inset-0 bg-stone-900/10 z-[100] flex items-center justify-center">
          <Spinner />
        </div>
      )}
      <Sidebar />

      <div className="ml-0 lg:ml-64 flex flex-col min-h-screen relative pb-16 lg:pb-0">
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
      </nav>
    </div>
  );
}
