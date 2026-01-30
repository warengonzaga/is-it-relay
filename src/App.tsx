import { useState, useEffect } from 'react';
import AddressInput from '@/components/AddressInput';
import DetectionResult from '@/components/DetectionResult';
import IsItRelayLogo from '@/components/IsItRelayLogo';
import Footer from '@/components/Footer';
import FAQ from '@/components/FAQ';
import { detectRelayAddress } from '@/services/relayApi';
import type { DetectionResult as DetectionResultType } from '@/types/relay';

function App() {
  const [result, setResult] = useState<DetectionResultType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check URL params on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const address = params.get('address');
    if (address) {
      handleDetect(address);
    }
  }, []);

  const handleDetect = async (address: string) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    // Update URL
    const url = new URL(window.location.href);
    url.searchParams.set('address', address);
    window.history.replaceState({}, '', url.toString());

    try {
      const detectionResult = await detectRelayAddress(address);
      setResult(detectionResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check address. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);

    // Clear URL params
    const url = new URL(window.location.href);
    url.searchParams.delete('address');
    window.history.replaceState({}, '', url.toString());
  };

  return (
    <div className="dark min-h-screen bg-background text-foreground flex flex-col">
      <div className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12">
        {/* Header */}
        <header className="text-center mb-8 sm:mb-10">
          <div className="flex items-center justify-center mb-4">
            <IsItRelayLogo className="h-10 sm:h-12 md:h-14" />
          </div>
          <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto">
            Detect if a wallet address is part of Relay Protocol infrastructure
          </p>
        </header>

        {/* Main Content */}
        {!result && (
          <AddressInput onDetect={handleDetect} isLoading={isLoading} />
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="w-full mx-auto">
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border rounded-lg p-4 sm:p-6 animate-in zoom-in-95 fade-in duration-300">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden flex-shrink-0 bg-muted animate-pulse">
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5" />
                </div>
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="h-4 sm:h-5 bg-muted rounded animate-pulse w-48 max-w-full" />
                  <div className="h-3 sm:h-4 bg-muted/50 rounded animate-pulse w-64 max-w-full" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mt-4 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
            <p className="text-sm text-destructive">{error}</p>
            <button
              onClick={handleReset}
              className="mt-2 text-xs text-destructive hover:underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Result */}
        {result && !isLoading && (
          <DetectionResult result={result} onReset={handleReset} />
        )}

        {/* FAQ - shown only when not loading and no result */}
        {!isLoading && !result && <FAQ />}

      </div>
      <Footer />
    </div>
  );
}

export default App;
