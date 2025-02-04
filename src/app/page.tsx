"use client"

import { WalletzButton, WalletzModal, useWalletz } from 'walletz';
import { useContext, useState, useEffect } from 'react';
import { ThemeContext } from './providers';
import { Moon, Sun } from 'lucide-react';
import bs58 from 'bs58'
import { TokenBalance } from 'walletz/src/types';

export default function Home() {
  const { signMessage, connected, getTokenBalances } = useWalletz();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [signature, setSignature] = useState<string | null>(null);
  const [tokenBalances, setTokenBalances] = useState<TokenBalance[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [signingMessage, setSigningMessage] = useState(false);
  const itemsPerPage = 10;

  const handleSign = async () => {
    try {
      setSigningMessage(true);
      const sig = await signMessage('Hello, Solana!');
      setSignature(bs58.encode(sig));
      console.log('Signature:', sig);
    } catch (error) {
      console.error('Signing failed:', error);
      setSignature(null);
    } finally {
      setSigningMessage(false);
    }
  };

  const handleGetTokenBalances = async () => {
    try {
      setLoading(true);
      const balances = await getTokenBalances();
      setTokenBalances(balances);
      if (balances.length === 0) {
        alert('No token balances found');
      }
    } catch (error) {
      console.error('Failed to fetch token balances:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBalances = tokenBalances.filter(balance => {
    const mintAddress = balance.account.data.parsed.info.mint.toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    const isMatch = mintAddress.includes(searchLower);
    
    return isMatch;
  });

  // Reset to page 1 when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const totalPages = Math.ceil(filteredBalances.length / itemsPerPage);
  const paginatedBalances = filteredBalances.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
            {connected && 
            <div className="flex flex-row items-center gap-4 p-8 rounded-lg">
            <button
              onClick={handleSign}
              disabled={signingMessage}
              className="px-6 py-2 bg-none text-gray-700 dark:text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {signingMessage ? 'Signing...' : 'Sign Message'}
            </button>
            <button
              onClick={handleGetTokenBalances}
              disabled={loading}
              className="px-6 py-2 bg-none text-gray-700 dark:text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Get Token Balances'}
            </button>
            </div>
            }
          </div>

          {/* Token Balances Display */}
          {tokenBalances.length > 0 && connected && (
            <div className="mt-6 p-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Token Balances
              </h2>
              
              {/* Search Input */}
              <input
                type="text"
                placeholder="Search by CA"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 mb-4 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />

              {/* Loading State */}
              {loading ? (
                <div className="text-center py-4">Loading...</div>
              ) : (
                <>
                  {/* Token List */}
                  <div className="space-y-3">
                    {paginatedBalances.map((balance) => (
                      <div
                        key={balance.pubkey}
                        className="p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <p className="font-mono text-sm text-gray-600 dark:text-gray-400">
                              CA: {balance.account.data.parsed.info.mint}
                            </p>
                            <p className="text-gray-900 dark:text-gray-100">
                              Balance: {balance.account.data.parsed.info.tokenAmount.uiAmountString}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center space-x-2 mt-4">
                      <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 rounded-lg border border-gray-200 dark:border-gray-600 disabled:opacity-50"
                      >
                        Previous
                      </button>
                      <span className="text-gray-700 dark:text-gray-300">
                        Page {currentPage} of {totalPages}
                      </span>
                      <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 rounded-lg border border-gray-200 dark:border-gray-600 disabled:opacity-50"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

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
