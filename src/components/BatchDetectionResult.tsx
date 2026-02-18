import type { BatchDetectionResult as BatchDetectionResultType } from '@/types/relay';
import DetectionResult from '@/components/DetectionResult';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RotateCcw, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

interface BatchDetectionResultProps {
  batchResult: BatchDetectionResultType;
  onReset: () => void;
}

export default function BatchDetectionResult({ batchResult, onReset }: BatchDetectionResultProps) {
  const relayAddresses = batchResult.results.filter(r => r.isRelay);
  const nonRelayAddresses = batchResult.results.filter(r => !r.isRelay);

  return (
    <div className="w-full mx-auto space-y-6">
      {/* Summary Card */}
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg sm:text-xl">Batch Detection Summary</CardTitle>
            <Button variant="default" size="sm" onClick={onReset}>
              <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5" />
              <span className="text-xs sm:text-sm">Check More</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Statistics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border/50">
              <div className="p-2 rounded-lg bg-primary/10">
                <CheckCircle2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Addresses</p>
                <p className="text-xl font-bold">{batchResult.totalAddresses}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border/50">
              <div className="p-2 rounded-lg bg-green-500/10">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Relay Protocol</p>
                <p className="text-xl font-bold text-green-500">{relayAddresses.length}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border/50">
              <div className="p-2 rounded-lg bg-muted">
                <XCircle className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Not Relay</p>
                <p className="text-xl font-bold">{nonRelayAddresses.length}</p>
              </div>
            </div>
          </div>

          {/* Invalid Addresses Warning */}
          {batchResult.invalidAddresses.length > 0 && (
            <div className="flex items-start gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
              <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-destructive mb-1">
                  {batchResult.invalidAddresses.length} Invalid Address{batchResult.invalidAddresses.length !== 1 ? 'es' : ''}
                </p>
                <p className="text-xs text-destructive/80">
                  The following addresses were skipped due to invalid format:
                </p>
                <div className="mt-2 space-y-1">
                  {batchResult.invalidAddresses.map((addr, idx) => (
                    <p key={idx} className="text-xs font-mono text-destructive/90 break-all">
                      • {addr}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Relay Protocol Addresses */}
      {relayAddresses.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            Relay Protocol Addresses ({relayAddresses.length})
          </h3>
          {relayAddresses.map((result, idx) => (
            <DetectionResult key={`relay-${idx}-${result.address}`} result={result} onReset={onReset} showResetButton={false} />
          ))}
        </div>
      )}

      {/* Non-Relay Addresses */}
      {nonRelayAddresses.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <XCircle className="h-5 w-5 text-muted-foreground" />
            Not Relay Protocol Addresses ({nonRelayAddresses.length})
          </h3>
          {nonRelayAddresses.map((result, idx) => (
            <DetectionResult key={`non-relay-${idx}-${result.address}`} result={result} onReset={onReset} showResetButton={false} />
          ))}
        </div>
      )}
    </div>
  );
}
