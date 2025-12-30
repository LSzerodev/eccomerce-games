'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAdminAuth } from '@/context/AdminAuthProvider';
import styles from './AdminGuard.module.css';

interface AdminGuardProps {
  children: React.ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const { isAuthenticated, isLoading } = useAdminAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Permitir acesso à página de acesso negado sem autenticação
  const isAccessDeniedPage = pathname === '/admin/access-denied';

  useEffect(() => {
    // Se não for a página de acesso negado e não estiver autenticado, redirecionar
    if (!isLoading && !isAuthenticated && !isAccessDeniedPage) {
      router.push('/admin/access-denied');
    }
  }, [isAuthenticated, isLoading, router, isAccessDeniedPage]);

  // Se for a página de acesso negado, sempre permitir acesso
  if (isAccessDeniedPage) {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p className={styles.loadingText}>Verificando acesso...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
