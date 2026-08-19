'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SignUpRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/sign-in?tab=register');
  }, [router]);

  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center">
      <div className="h-6 w-6 border-2 border-cobalt border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
