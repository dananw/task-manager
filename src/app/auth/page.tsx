'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { NavigationHeader } from '../components/navigation-header';
import { AuthForms } from '../components/auth/auth-forms';

export default function AuthPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me');
      const result = await response.json();

      if (result.success) {
        setUser(result.data.user);
        router.push('/');
      }
    } catch (error) {
      // User is not authenticated
    }
  };

  const handleAuthSuccess = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader user={user} />
      <AuthForms onSuccess={handleAuthSuccess} />
    </div>
  );
}