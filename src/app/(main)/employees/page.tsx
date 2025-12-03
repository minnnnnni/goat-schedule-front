
"use client";

import { useEffect } from 'react';

export default function Page() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (!localStorage.getItem('access_token')) {
        localStorage.setItem('access_token', 'test-access-token');
      }
      const token = localStorage.getItem('access_token');
      if (!token) {
        window.location.href = '/login';
      }
    }
  }, []);
  return <div>Employees Page</div>;
}

