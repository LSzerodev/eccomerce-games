'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './access-denied.module.css';

export default function AccessDeniedPage() {
  const router = useRouter();
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    // Verificar se já está autenticado via cookie
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/admin/check', {
          method: 'GET',
          credentials: 'include',
        });
        const data = await response.json();
        if (data.valid) {
          router.push('/admin/products');
        }
      } catch (err) {
        // Ignorar erros, deixar o usuário inserir a chave
      }
    };

    checkAuth();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsValidating(true);

    if (!apiKey || apiKey.trim().length === 0) {
      setError('Por favor, insira a chave de acesso');
      setIsValidating(false);
      return;
    }

    try {
      // Validar a chave via API route do Next.js
      const response = await fetch('/api/admin/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ apiKey: apiKey.trim() }),
      });

      const result = await response.json();

      if (result.valid) {
        // Se a chave for válida, o cookie já foi setado pela API route
        // Redirecionar para admin
        router.push('/admin/products');
        router.refresh(); // Forçar refresh para atualizar o middleware
      } else {
        setError(result.error || 'Chave de acesso inválida. Por favor, verifique e tente novamente.');
      }
    } catch (err: unknown) {
      setError('Erro ao validar chave de acesso. Por favor, tente novamente.');
      console.error('Erro ao validar API Key:', err);
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.iconContainer}>
          <svg
            className={styles.lockIcon}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>

        <h1 className={styles.title}>Acesso Restrito</h1>
        <p className={styles.subtitle}>
          Esta área é restrita a administradores. Por favor, insira sua chave de acesso.
        </p>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="apiKey" className={styles.label}>
              Chave de Acesso
            </label>
            <input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Digite sua chave de acesso"
              className={styles.input}
              autoFocus
            />
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isValidating}
          >
            {isValidating ? 'Validando...' : 'Acessar Painel Admin'}
          </button>
        </form>
      </div>
    </div>
  );
}
