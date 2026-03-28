'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';

export default function Home() {
  const { isAuthenticated, fetchUser } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await fetchUser();
        if (isAuthenticated) {
          router.push('/dashboard');
        } else {
          router.push('/login');
        }
      } catch {
        router.push('/login');
      }
    };

    checkAuth();
  }, [fetchUser, isAuthenticated, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="text-center text-white">
        <h1 className="text-4xl font-bold mb-4">RecruitAI</h1>
        <p className="text-xl">Загрузка...</p>
      </div>
    </div>
  );
}
