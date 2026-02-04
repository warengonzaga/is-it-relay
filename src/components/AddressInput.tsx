import { useState } from 'react';
import { isValidAddress } from '@/services/relayApi';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Sparkles } from 'lucide-react';

interface AddressInputProps {
  onDetect: (address: string) => void;
  isLoading: boolean;
}

export default function AddressInput({ onDetect, isLoading }: AddressInputProps) {
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmed = address.trim();
    if (!trimmed) {
      setError('Please enter an address');
      return;
    }

    if (!isValidAddress(trimmed)) {
      setError('Invalid address format. Enter an EVM address (0x...) or a Solana address.');
      return;
    }

    onDetect(trimmed);
  };

  return (
    <div className="relative group w-full mx-auto">
      {/* Animated border effect on hover */}
      <div className="absolute -inset-[2px] opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300 overflow-hidden" style={{ borderRadius: 'calc(var(--radius) + 2px)' }}>
        <div className="absolute inset-[-100%] animate-border-spin-bg" />
      </div>

      <Card className="relative w-full border border-border/50 shadow-2xl bg-card transition-all duration-300 group-hover:shadow-[0_0_40px_rgba(139,92,246,0.2)] group-focus-within:shadow-[0_0_40px_rgba(139,92,246,0.2)]">
        <CardHeader className="space-y-3 sm:space-y-4 pb-4 sm:pb-6">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Search className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            </div>
            <CardTitle className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Is It Relay?
            </CardTitle>
          </div>
          <CardDescription className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Enter an EVM or Solana address to check if it's part of Relay Protocol infrastructure. Detects solver addresses, depository contracts, and protocol contracts across all supported chains.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <div className="space-y-2">
              <label htmlFor="address-input" className="text-xs sm:text-sm font-semibold text-foreground/90 flex items-center gap-2">
                Address
                <span className="text-xs font-normal text-muted-foreground">(EVM &amp; SVM)</span>
              </label>
              <div className="relative">
                <Input
                  id="address-input"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="0x... or Solana address"
                  disabled={isLoading}
                  className="font-mono text-xs sm:text-sm h-11 sm:h-12 bg-background/50 border-2 focus:border-primary transition-colors pr-12"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/40">
                  <Sparkles className="h-4 w-4" />
                </div>
              </div>
              {error && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                  <p className="text-xs sm:text-sm text-destructive leading-relaxed">{error}</p>
                </div>
              )}
            </div>
            {address.trim() && (
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full text-sm sm:text-base h-11 sm:h-12 font-semibold shadow-lg hover:shadow-xl transition-all animate-in fade-in slide-in-from-bottom-2 duration-200"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Checking...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    Detect Relay Protocol Address
                  </span>
                )}
              </Button>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
