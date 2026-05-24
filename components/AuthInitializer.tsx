'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '@/lib/store/hooks';
import { loginSuccess } from '@/lib/store/authSlice';

export default function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => {
        if (!res.ok) throw new Error('Not authenticated');
        return res.json();
      })
      .then(data => {
        if (data.user) {
          dispatch(loginSuccess(data.user));
        }
      })
      .catch(() => {});
  }, [dispatch]);

  return <>{children}</>;
}
