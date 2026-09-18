'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';

export interface AdminSearchRegistrationConfig {
  inputRef: React.RefObject<HTMLInputElement | null>;
  focus?: () => void;
  reveal?: () => void | Promise<void>;
  placeholder?: string;
}

interface AdminSearchContextValue {
  registration: AdminSearchRegistrationConfig | null;
  register: (registration: AdminSearchRegistrationConfig) => () => void;
  activate: () => Promise<void>;
}

const AdminSearchContext = React.createContext<AdminSearchContextValue | null>(null);

function AdminSearchRouteReset({ onNavigate }: { onNavigate: () => void }) {
  const pathname = usePathname();

  React.useEffect(() => {
    onNavigate();
  }, [onNavigate, pathname]);

  return null;
}

export function AdminSearchProvider({ children }: { children: React.ReactNode }) {
  const [registration, setRegistration] =
    React.useState<AdminSearchRegistrationConfig | null>(null);

  const register = React.useCallback((nextRegistration: AdminSearchRegistrationConfig) => {
    setRegistration(nextRegistration);

    return () => {
      setRegistration((current) => (current === nextRegistration ? null : current));
    };
  }, []);

  const clearRegistration = React.useCallback(() => setRegistration(null), []);

  const activate = React.useCallback(async () => {
    if (!registration) return;

    await registration.reveal?.();
    window.requestAnimationFrame(() => {
      if (registration.focus) {
        registration.focus();
        return;
      }

      registration.inputRef.current?.focus();
    });
  }, [registration]);

  const value = React.useMemo(
    () => ({ registration, register, activate }),
    [activate, register, registration]
  );

  return (
    <AdminSearchContext.Provider value={value}>
      <React.Suspense fallback={null}>
        <AdminSearchRouteReset onNavigate={clearRegistration} />
      </React.Suspense>
      {children}
    </AdminSearchContext.Provider>
  );
}

export function useAdminSearch() {
  const context = React.useContext(AdminSearchContext);
  if (!context) {
    throw new Error('useAdminSearch must be used within an AdminSearchProvider.');
  }
  return context;
}

export function useAdminSearchRegistration(
  registration: AdminSearchRegistrationConfig | null
) {
  const { register } = useAdminSearch();
  const pathname = usePathname();
  const inputRef = registration?.inputRef;
  const focus = registration?.focus;
  const reveal = registration?.reveal;
  const placeholder = registration?.placeholder;

  React.useEffect(() => {
    if (!inputRef) return;
    return register({ inputRef, focus, reveal, placeholder });
  }, [focus, inputRef, pathname, placeholder, register, reveal]);
}

export function AdminSearchRegistration(props: AdminSearchRegistrationConfig) {
  useAdminSearchRegistration(props);
  return null;
}
