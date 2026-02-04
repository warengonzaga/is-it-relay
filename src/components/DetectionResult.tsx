import type { DetectionResult as DetectionResultType, ContractMatch } from '@/types/relay';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, ExternalLink, Copy, Check, RotateCcw, Eye, EyeOff, Share2, Shield, Database, ChevronDown, FileCode, Boxes, ArrowLeftRight, CheckSquare, Inbox, type LucideIcon } from 'lucide-react';
import { useState } from 'react';
import Avatar from 'boring-avatars';

// Icon mapping based on contract type patterns
const getContractIcon = (contractType: string): LucideIcon => {
  const lowerType = contractType.toLowerCase();

  if (lowerType.includes('multicall')) return Boxes;
  if (lowerType.includes('router')) return ArrowLeftRight;
  if (lowerType.includes('approval') || lowerType.includes('proxy')) return CheckSquare;
  if (lowerType.includes('receiver')) return Inbox;

  return FileCode;
};

// Human-readable contract type names
const formatContractType = (contractType: string): string => {
  return contractType
    .split('.')
    .map(part =>
      part
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
        .replace(/erc(\d+)/gi, 'ERC$1')
        .trim()
    )
    .join(' ');
};

interface DetectionResultProps {
  result: DetectionResultType;
  onReset: () => void;
}

export default function DetectionResult({ result, onReset }: DetectionResultProps) {
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const [isAddressVisible, setIsAddressVisible] = useState(false);
  const [solverExpanded, setSolverExpanded] = useState(false);
  const [depositoryExpanded, setDepositoryExpanded] = useState(false);
  const [contractExpandedMap, setContractExpandedMap] = useState<Record<string, boolean>>({});

  const toggleContractSection = (contractType: string) => {
    setContractExpandedMap(prev => ({
      ...prev,
      [contractType]: !prev[contractType]
    }));
  };

  const truncateAddress = (addr: string) => {
    if (addr.length <= 10) return addr;
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShare = async () => {
    try {
      const shareUrl = `${window.location.origin}${window.location.pathname}?address=${result.address}`;
      await navigator.clipboard.writeText(shareUrl);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  // Group matches by type
  const solverMatches = result.matches.filter(m => m.matchType === 'solver');
  const depositoryMatches = result.matches.filter(m => m.matchType === 'depository');
  const contractMatches = result.matches.filter(
    (m): m is ContractMatch => m.matchType === 'contract'
  );

  // Group contract matches by contractType for display
  const contractMatchesByType = contractMatches.reduce<Record<string, ContractMatch[]>>(
    (acc, match) => {
      const type = match.contractType;
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(match);
      return acc;
    },
    {}
  );

  // Get sorted list of contract types for consistent ordering
  const sortedContractTypes = Object.keys(contractMatchesByType).sort();

  // Generate result title
  const getResultTitle = () => {
    if (!result.isRelay) return 'Not Part of Relay Protocol';

    const types: string[] = [];
    if (solverMatches.length > 0) types.push('Solver');
    if (depositoryMatches.length > 0) types.push('Depository');
    if (contractMatches.length > 0) types.push('Contract');

    return `Relay Protocol ${types.join(' & ')} Address`;
  };

  return (
    <div className="w-full mx-auto space-y-4">
      {/* Profile Header */}
      <div className={`bg-gradient-to-r ${result.isRelay ? 'from-green-500/10 via-primary/5' : 'from-destructive/10 via-destructive/5'} to-background border rounded-lg p-4 sm:p-6`}>
        <div className="flex items-start gap-3 sm:gap-4 mb-4">
          {/* Avatar */}
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden flex-shrink-0">
            <Avatar
              size={64}
              name={result.address}
              variant="pixel"
              colors={result.isRelay
                ? ['hsl(142, 76%, 36%)', 'hsl(142, 76%, 46%)', 'hsl(258, 90%, 66%)', 'hsl(258, 90%, 56%)', 'hsl(258, 90%, 46%)']
                : ['hsl(0, 84%, 60%)', 'hsl(0, 84%, 50%)', 'hsl(0, 84%, 40%)', 'hsl(0, 60%, 30%)', 'hsl(0, 40%, 20%)']}
            />
          </div>

          {/* Address Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {result.isRelay ? (
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
              ) : (
                <XCircle className="h-5 w-5 text-destructive flex-shrink-0" />
              )}
              <h2 className="text-base sm:text-lg font-semibold">
                {getResultTitle()}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs sm:text-sm text-muted-foreground break-all">
                {isAddressVisible ? result.address : truncateAddress(result.address)}
              </span>
              <button
                onClick={() => setIsAddressVisible(!isAddressVisible)}
                className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors"
              >
                {isAddressVisible ? (
                  <EyeOff className="h-3 w-3 sm:h-4 sm:w-4" />
                ) : (
                  <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={handleCopy}
            className={`transition-colors ${copied ? 'border-green-500 bg-green-500/10' : ''}`}>
            {copied ? (
              <><Check className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 text-green-500" /><span className="text-xs sm:text-sm">Copied</span></>
            ) : (
              <><Copy className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5" /><span className="text-xs sm:text-sm">Copy</span></>
            )}
          </Button>
          <Button variant="outline" size="sm" onClick={handleShare}
            className={`transition-colors ${shared ? 'border-green-500 bg-green-500/10' : ''}`}>
            {shared ? (
              <><Check className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 text-green-500" /><span className="text-xs sm:text-sm">Link Copied</span></>
            ) : (
              <><Share2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5" /><span className="text-xs sm:text-sm">Share</span></>
            )}
          </Button>
          <Button variant="default" size="sm" onClick={onReset} className="ml-auto">
            <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5" />
            <span className="text-xs sm:text-sm">Check Another</span>
          </Button>
        </div>
      </div>

      {/* Result Details */}
      {result.isRelay ? (
        <div className="space-y-4">
          {/* Summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm sm:text-base">Detection Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                This address was found in <span className="text-foreground font-semibold">{result.matches.length}</span> match{result.matches.length !== 1 ? 'es' : ''} across Relay Protocol chains.
                {solverMatches.length > 0 && (
                  <> It serves as a <span className="text-primary font-semibold">solver address</span> on {solverMatches.length} chain{solverMatches.length !== 1 ? 's' : ''}.</>
                )}
                {depositoryMatches.length > 0 && (
                  <> It is a <span className="text-primary font-semibold">v2 depository contract</span> on {depositoryMatches.length} chain{depositoryMatches.length !== 1 ? 's' : ''}.</>
                )}
                {contractMatches.length > 0 && (
                  <> It is a <span className="text-primary font-semibold">protocol contract</span> ({sortedContractTypes.length} type{sortedContractTypes.length !== 1 ? 's' : ''}) on {new Set(contractMatches.map(m => m.chainId)).size} chain{new Set(contractMatches.map(m => m.chainId)).size !== 1 ? 's' : ''}.</>
                )}
              </p>
            </CardContent>
          </Card>

          {/* Solver Matches */}
          {solverMatches.length > 0 && (
            <Card>
              <button
                onClick={() => setSolverExpanded(!solverExpanded)}
                className="w-full text-left"
              >
                <CardHeader className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-primary" />
                      <CardTitle className="text-sm sm:text-base">Solver Address</CardTitle>
                      <span className="text-sm sm:text-base text-muted-foreground font-normal">({solverMatches.length} chain{solverMatches.length !== 1 ? 's' : ''})</span>
                    </div>
                    <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${solverExpanded ? 'rotate-180' : ''}`} />
                  </div>
                </CardHeader>
              </button>
              {solverExpanded && (
                <CardContent>
                  <div className="space-y-2">
                    {solverMatches.map((match) => (
                      <div key={`solver-${match.chainId}`} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border/50">
                        <div className="flex items-center gap-3">
                          <img
                            src={match.iconUrl}
                            alt={match.chainDisplayName}
                            className="w-6 h-6 rounded-full"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                          />
                          <div>
                            <p className="text-sm font-medium">{match.chainDisplayName}</p>
                            <p className="text-xs text-muted-foreground">Chain ID: {match.chainId}</p>
                          </div>
                        </div>
                        {match.explorerUrl && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => { e.stopPropagation(); window.open(`${match.explorerUrl}/address/${match.address}`, '_blank', 'noopener,noreferrer'); }}
                          >
                            <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          )}

          {/* Depository Matches */}
          {depositoryMatches.length > 0 && (
            <Card>
              <button
                onClick={() => setDepositoryExpanded(!depositoryExpanded)}
                className="w-full text-left"
              >
                <CardHeader className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Database className="h-4 w-4 text-primary" />
                      <CardTitle className="text-sm sm:text-base">V2 Depository Contract</CardTitle>
                      <span className="text-sm sm:text-base text-muted-foreground font-normal">({depositoryMatches.length} chain{depositoryMatches.length !== 1 ? 's' : ''})</span>
                    </div>
                    <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${depositoryExpanded ? 'rotate-180' : ''}`} />
                  </div>
                </CardHeader>
              </button>
              {depositoryExpanded && (
                <CardContent>
                  <div className="space-y-2">
                    {depositoryMatches.map((match) => (
                      <div key={`depository-${match.chainId}`} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border/50">
                        <div className="flex items-center gap-3">
                          <img
                            src={match.iconUrl}
                            alt={match.chainDisplayName}
                            className="w-6 h-6 rounded-full"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                          />
                          <div>
                            <p className="text-sm font-medium">{match.chainDisplayName}</p>
                            <p className="text-xs text-muted-foreground">Chain ID: {match.chainId}</p>
                          </div>
                        </div>
                        {match.explorerUrl && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => { e.stopPropagation(); window.open(`${match.explorerUrl}/address/${match.address}`, '_blank', 'noopener,noreferrer'); }}
                          >
                            <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          )}

          {/* Contract Matches - one section per contract type */}
          {sortedContractTypes.map(contractType => {
            const IconComponent = getContractIcon(contractType);
            const matches = contractMatchesByType[contractType];
            const isExpanded = contractExpandedMap[contractType] ?? false;

            return (
              <Card key={contractType}>
                <button
                  onClick={() => toggleContractSection(contractType)}
                  className="w-full text-left"
                >
                  <CardHeader className="py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <IconComponent className="h-4 w-4 text-primary" />
                        <CardTitle className="text-sm sm:text-base">{formatContractType(contractType)}</CardTitle>
                        <span className="text-sm sm:text-base text-muted-foreground font-normal">({matches.length} chain{matches.length !== 1 ? 's' : ''})</span>
                      </div>
                      <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                    </div>
                  </CardHeader>
                </button>
                {isExpanded && (
                  <CardContent>
                    <div className="space-y-2">
                      {matches.map((match) => (
                        <div key={`${contractType}-${match.chainId}`} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border/50">
                          <div className="flex items-center gap-3">
                            <img
                              src={match.iconUrl}
                              alt={match.chainDisplayName}
                              className="w-6 h-6 rounded-full"
                              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                            />
                            <div>
                              <p className="text-sm font-medium">{match.chainDisplayName}</p>
                              <p className="text-xs text-muted-foreground">Chain ID: {match.chainId}</p>
                            </div>
                          </div>
                          {match.explorerUrl && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => { e.stopPropagation(); window.open(`${match.explorerUrl}/address/${match.address}`, '_blank', 'noopener,noreferrer'); }}
                            >
                              <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                This address was not found in any Relay Protocol solver addresses, depository contracts, or protocol contracts across all supported chains.
              </p>
              <p className="text-xs text-muted-foreground/70">
                Note: This checks solver addresses, depository contracts, and protocol infrastructure contracts (multicall, routers, receivers, etc.) from the Relay Protocol API.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
