"use client"

import { WalletzButton, WalletzModal, useWalletz } from 'walletz';
import { useContext, useState } from 'react';
import { ThemeContext } from './providers';
import { Moon, Sun } from 'lucide-react';
import bs58 from 'bs58'

export default function Home() {
  const { signMessage, connected } = useWalletz();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [signature, setSignature] = useState<string | null>(null);

  const handleSign = async () => {
    try {
      const sig = await signMessage('Hello, Solana!');
      setSignature(bs58.encode(sig));
      console.log('Signature:', sig);
    } catch (error) {
      console.error('Signing failed:', error);
      setSignature(null);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
            Demo
          </h1>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {theme === 'dark' ? (
              <Sun className="h-6 w-6 text-gray-300" />
            ) : (
              <Moon className="h-6 w-6 text-gray-700" />
            )}
          </button>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col items-center gap-4 p-8 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <WalletzButton />
            <WalletzModal />
            {connected && <button
              onClick={handleSign}
              className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity"
            >
              Sign Message
            </button>}
          </div>

          {signature && connected && (
            <div className="mt-6 p-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
                Signature
              </h2>
              <p className="font-mono text-sm break-all text-gray-600 dark:text-gray-400">
                {signature}
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
