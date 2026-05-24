'use client';

import { AppProvider, useApp } from '@/lib/app-context';
import LoginView from '@/components/LoginView';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

function LoginPageInner() {
  const { isLoggedIn } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn) {
      router.push('/dashboard');
    }
  }, [isLoggedIn, router]);

  if (isLoggedIn) return null;

  return <LoginView />;
}

export default function LoginPage() {
  return (
    <AppProvider>
      <LoginPageInner />
    </AppProvider>
  );
}
