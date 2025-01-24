'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  
  useEffect(() => {
    if (window.location.pathname.startsWith('/admin/login')) {
      console.log("[i] Detected login page, skipping validation");
      setAuthorized(true);
      setLoading(false);
      return;
    }

    const cookies = document.cookie.split(';').reduce((acc, cookie) => {
      const [name, value] = cookie.split('=').map((c) => c.trim());
      acc[name] = value;
      return acc;
    }, {} as Record<string, string>);

    const validate = async () => {
      const key = cookies.key;
      if (!key) {
        console.log("[!] No key found, clearing cookies and redirecting to login");
        document.cookie.split(';').forEach((cookie) => {
          const [name] = cookie.split('=');
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        });
        window.location.href = '/admin/login';
        return;
      }
      const response = await fetch('http://localhost:3001/api/admin/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key: cookies.key, username: cookies.username }),
      });
      
      if (!response.ok) {
        console.log('[!] Failed to check key, skipping validation and clearing cookie');
        document.cookie = 'key=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        window.location.href = '/admin/login';
      } else {
        const data = await response.json()
        if (data.success) {
          console.log("[✓] Key is valid");
          setAuthorized(true);
        } else {
          console.log("[✖] Key is invalid, clearing cookie and redirecting to login");
          document.cookie = 'key=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
          window.location.href = '/admin/login';
        }
      }
      setLoading(false);
    };

    if (typeof window !== 'undefined') {
      validate();
    }
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-slate-800 border-white"></div>
      </div>
    );
  }

  if (!authorized) {
    return null;
  }

  return <div className="relative flex min-h-screen flex-col">{children}</div>;
}