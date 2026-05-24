'use client';

import { Provider } from 'react-redux';
import { store } from '@/lib/store';
import { AppProvider } from '@/lib/app-context';
import AuthInitializer from './AuthInitializer';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AppProvider>
        <AuthInitializer>
          {children}
        </AuthInitializer>
      </AppProvider>
    </Provider>
  );
}
