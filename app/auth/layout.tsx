'use client';

import { useEffect } from 'react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Detect iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

    if (isIOS) {
      // On iOS: fix body position to prevent Safari UI expansion issues
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.height = '100vh';
      document.body.style.overflow = 'hidden';
    } else {
      // On other browsers: just prevent scroll
      document.body.style.overflow = 'hidden';
    }

    // Force black background on body for auth pages
    const originalBg = document.body.style.backgroundColor;
    document.body.style.backgroundColor = '#1a1a1a'; // var(--color-dark)

    return () => {
      // Cleanup on unmount
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
      document.body.style.overflow = '';
      document.body.style.backgroundColor = originalBg;
    };
  }, []);

  return <>{children}</>;
}
