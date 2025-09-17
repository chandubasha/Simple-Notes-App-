'use client';

import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // apply saved theme on mount
    const saved = localStorage.getItem('theme');
    if (saved) {
      document.documentElement.classList.toggle('dark', saved === 'dark');
    }
  }, []);

  if (!mounted) return null;

  function toggleTheme() {
    const root = document.documentElement;
    const isDark = root.classList.contains('dark');
    root.classList.toggle('dark', !isDark);
    localStorage.setItem('theme', !isDark ? 'dark' : 'light');
  }

  return (
    <button
      onClick={toggleTheme}
      className="rounded-2xl border px-3 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
    >
      Toggle theme
    </button>
  );
}
