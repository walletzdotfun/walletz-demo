"use client";

import React, { createContext, useEffect, useState } from "react";
import { WalletzConfig, WalletzProvider } from "walletz";

type ThemeContextType = {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
};

export const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  toggleTheme: () => {},
});

export default function Providers({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const LocalWalletzConfig: WalletzConfig = {
    rpcUrl: "https://api.mainnet-beta.solana.com",
    autoConnect: true,
    theme: theme,
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <WalletzProvider config={LocalWalletzConfig}>
        <div className={theme}>
          <div className="min-h-screen transition-colors duration-200 bg-gray-50 dark:bg-gray-900">
            {children}
          </div>
        </div>
      </WalletzProvider>
    </ThemeContext.Provider>
  );
}
