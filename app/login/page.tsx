'use client';

import LoginView from '@/components/LoginView';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/lib/store/hooks';

export default function LoginPage() {
  const isLoggedIn = useAppSelector(s => s.auth.isLoggedIn);
  const user = useAppSelector(s => s.auth.user);
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn && user) {
      const target = user.role === 'admin' ? '/admin/users' : user.role === 'executive' ? '/executive' : '/employee';
      router.push(target);
    }
  }, [isLoggedIn, user, router]);

  if (isLoggedIn) return null;

  return <LoginView />;
}
