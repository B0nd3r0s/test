import { useEffect } from 'react';
import { useAuthStore } from '@/store';
import { useRouter } from 'next/navigation';

export function useAuth(requireAuth = true) {
  const { user, isAuthenticated, isLoading, fetchUser } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (requireAuth && !isAuthenticated && !isLoading) {
      fetchUser().catch(() => {
        router.push('/login');
      });
    }
  }, [isAuthenticated, isLoading, requireAuth, fetchUser, router]);

  return { user, isAuthenticated, isLoading };
}

export function useLogout() {
  const { logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return handleLogout;
}
