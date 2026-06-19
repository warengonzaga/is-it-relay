import axios from 'axios';
import type { RelayChain, DetectionResult, AddressMatch, BatchDetectionResult, RelayRequestMetadata } from '@/types/relay';

const RELAY_API_BASE = 'https://api.relay.link';
const RELAY_API_KEY = import.meta.env.VITE_RELAY_API_KEY;
const relayApiClient = axios.create({
  baseURL: RELAY_API_BASE,
  headers: RELAY_API_KEY ? { 'x-api-key': RELAY_API_KEY } : undefined,
});

export function isValidEthereumAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

export function isValidSolanaAddress(address: string): boolean {
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
}

export function isValidBitcoinAddress(address: string): boolean {
  // Legacy P2PKH (starts with 1)
  const legacyP2PKH = /^1[1-9A-HJ-NP-Za-km-z]{24,33}$/;
  // Script P2SH (starts with 3)
  const scriptP2SH = /^3[1-9A-HJ-NP-Za-km-z]{24,33}$/;
  // Native SegWit Bech32 (starts with bc1q)
  const nativeSegWit = /^bc1q[a-z0-9]{38,58}$/;
  // Taproot Bech32m (starts with bc1p)
  const taproot = /^bc1p[a-z0-9]{58}$/;

  return (
    legacyP2PKH.test(address) ||
    scriptP2SH.test(address) ||
    nativeSegWit.test(address) ||
    taproot.test(address)
  );
}

export function isValidAddress(address: string): boolean {
  return isValidEthereumAddress(address) || isValidSolanaAddress(address) || isValidBitcoinAddress(address);
}

export async function fetchChains(): Promise<RelayChain[]> {
  const response = await relayApiClient.get<{ chains: RelayChain[] }>('/chains');
  return response.data.chains ?? response.data as unknown as RelayChain[];
}

function addressesMatch(a: string, b: string, vmType: string): boolean {
  if (vmType === 'svm' || vmType === 'bvm') {
    return a === b; // Case-sensitive for Solana and Bitcoin
  }
  return a.toLowerCase() === b.toLowerCase(); // Case-insensitive for EVM
}

function requestAddressesMatch(a: string, b: string): boolean {
  if (isValidEthereumAddress(a) || isValidEthereumAddress(b)) {
    return a.toLowerCase() === b.toLowerCase();
  }

  return a === b;
}

interface RelayRequestApiRecord {
  id: string;
  status: string;
  depositAddress?: {
    address?: string;
    depositAddressType?: string;
    depositTxHash?: string | null;
  } | null;
  protocol?: {
    v2?: {
      orderId?: string;
    };
  } | null;
  originChainId?: number;
  destinationChainId?: number;
  data?: {
    metadata?: {
      currencyIn?: {
        currency?: {
          chainId?: number;
        };
      };
      currencyOut?: {
        currency?: {
          chainId?: number;
        };
      };
    };
  };
  childRequests?: RelayRequestApiRecord[];
}

interface RelayRequestsResponse {
  requests?: RelayRequestApiRecord[];
}

function mapRelayRequest(request: RelayRequestApiRecord): RelayRequestMetadata | null {
  if (!request.depositAddress?.address) {
    return null;
  }

  return {
    requestId: request.id,
    status: request.status,
    depositAddress: {
      address: request.depositAddress.address,
      depositAddressType: request.depositAddress.depositAddressType,
      depositTxHash: request.depositAddress.depositTxHash,
    },
    protocolOrderId: request.protocol?.v2?.orderId,
    originChainId: request.originChainId ?? request.data?.metadata?.currencyIn?.currency?.chainId,
    destinationChainId: request.destinationChainId ?? request.data?.metadata?.currencyOut?.currency?.chainId,
    childRequests: request.childRequests?.map(mapRelayRequest).filter((child): child is NonNullable<ReturnType<typeof mapRelayRequest>> => child !== null),
  };
}

async function fetchDepositAddressMatches(address: string): Promise<AddressMatch[]> {
  const response = await relayApiClient.get<RelayRequestsResponse>('/requests/v2', {
    params: {
      depositAddress: address,
      includeChildRequests: true,
    },
  });

  return (response.data.requests ?? []).reduce<AddressMatch[]>((matches, request) => {
    const mappedRequest = mapRelayRequest(request);

    if (!mappedRequest || !requestAddressesMatch(mappedRequest.depositAddress.address, address)) {
      return matches;
    }

    matches.push({
      matchType: 'deposit-address',
      address: mappedRequest.depositAddress.address,
      request: mappedRequest,
    });

    return matches;
  }, []);
}

/**
 * Flattens a nested contracts object into an array of [path, address] pairs.
 * Example: { multicall3: "0x...", v3: { erc20Router: "0x..." } }
 * Returns: [["multicall3", "0x..."], ["v3.erc20Router", "0x..."]]
 */
function flattenContracts(
  contracts: Record<string, unknown>,
  prefix: string = ''
): Array<[string, string]> {
  const result: Array<[string, string]> = [];

  for (const [key, value] of Object.entries(contracts)) {
    const path = prefix ? `${prefix}.${key}` : key;

    if (typeof value === 'string') {
      result.push([path, value]);
    } else if (typeof value === 'object' && value !== null) {
      result.push(...flattenContracts(value as Record<string, unknown>, path));
    }
  }

  return result;
}

/**
 * Internal function to detect a single address against provided chains
 */
function detectAddressInChains(address: string, chains: RelayChain[]): DetectionResult {
  const matches: AddressMatch[] = [];

  for (const chain of chains) {
    // Check solverAddresses
    if (chain.solverAddresses) {
      for (const solver of chain.solverAddresses) {
        if (addressesMatch(solver, address, chain.vmType)) {
          matches.push({
            chainId: chain.id,
            chainName: chain.name,
            chainDisplayName: chain.displayName,
            explorerUrl: chain.explorerUrl,
            iconUrl: chain.iconUrl,
            matchType: 'solver',
            address: solver,
          });
        }
      }
    }

    // Check protocol.v2.depository
    if (chain.protocol?.v2?.depository) {
      if (addressesMatch(chain.protocol.v2.depository, address, chain.vmType)) {
        matches.push({
          chainId: chain.id,
          chainName: chain.name,
          chainDisplayName: chain.displayName,
          explorerUrl: chain.explorerUrl,
          iconUrl: chain.iconUrl,
          matchType: 'depository',
          address: chain.protocol.v2.depository,
        });
      }
    }

    // Check contracts
    if (chain.contracts) {
      const flattenedContracts = flattenContracts(chain.contracts);
      for (const [contractType, contractAddress] of flattenedContracts) {
        if (addressesMatch(contractAddress, address, chain.vmType)) {
          matches.push({
            chainId: chain.id,
            chainName: chain.name,
            chainDisplayName: chain.displayName,
            explorerUrl: chain.explorerUrl,
            iconUrl: chain.iconUrl,
            matchType: 'contract',
            contractType,
            address: contractAddress,
          });
        }
      }
    }
  }

  return {
    isRelay: matches.length > 0,
    address,
    matches,
  };
}

export async function detectRelayAddress(address: string): Promise<DetectionResult> {
  const chains = await fetchChains();
  let depositAddressLookupUnavailable = false;
  let depositAddressMatches: AddressMatch[] = [];

  try {
    depositAddressMatches = await fetchDepositAddressMatches(address);
  } catch (error) {
    depositAddressLookupUnavailable = true;
    console.warn('Relay deposit address lookup failed:', error);
  }

  const chainResult = detectAddressInChains(address, chains);

  return {
    ...chainResult,
    isRelay: chainResult.matches.length + depositAddressMatches.length > 0,
    matches: [...chainResult.matches, ...depositAddressMatches],
    depositAddressLookupUnavailable,
  };
}

/**
 * Parse multiple addresses from a string using various delimiters
 * 
 * Handles edge cases including:
 * - Comma-separated without spaces: "0x123,0x456,0x789"
 * - Comma-separated with spaces: "0x123, 0x456, 0x789"
 * - Newline-separated: "0x123\n0x456\n0x789"
 * - Space-separated: "0x123 0x456 0x789"
 * - Mixed delimiters: "0x123,0x456\n0x789 0xabc"
 * - Extra whitespace/commas: "0x123,,  0x456,\n\n0x789"
 * 
 * @param input - Raw input string containing one or more addresses
 * @returns Array of unique, trimmed addresses
 */
export function parseMultipleAddresses(input: string): string[] {
  // Split by comma or any whitespace (spaces, tabs, newlines)
  // The regex /[\s,]+/ matches one or more of: comma or any whitespace character
  // Note: \s already includes newlines, spaces, tabs, etc.
  const addresses = input
    .split(/[\s,]+/)
    .map(addr => addr.trim())
    .filter(addr => addr.length > 0);
  
  // Remove duplicates by using Set
  return [...new Set(addresses)];
}

/**
 * Detect multiple addresses in batch
 * Note: Assumes addresses are already validated by the caller (AddressInput component)
 */
export async function detectMultipleAddresses(addresses: string[]): Promise<BatchDetectionResult> {
  // Fetch chains once for all addresses to avoid redundant API calls
  const chains = await fetchChains();
  
  const validAddresses: string[] = [];
  const invalidAddresses: string[] = [];
  
  // Validate all addresses (defensive check, though caller should validate)
  for (const address of addresses) {
    if (isValidAddress(address)) {
      validAddresses.push(address);
    } else {
      invalidAddresses.push(address);
    }
  }
  
  // Detect valid addresses using the same chains data
  const depositAddressMatchesByAddress: Array<AddressMatch[] | null> = [];
  for (const address of validAddresses) {
    try {
      depositAddressMatchesByAddress.push(await fetchDepositAddressMatches(address));
    } catch (error) {
      console.warn(`Relay deposit address lookup failed for ${address}:`, error);
      depositAddressMatchesByAddress.push(null);
    }
  }

  const results: DetectionResult[] = [];
  for (const [index, address] of validAddresses.entries()) {
    const chainResult = detectAddressInChains(address, chains);
    const depositAddressMatches = depositAddressMatchesByAddress[index] ?? [];

    results.push({
      ...chainResult,
      isRelay: chainResult.matches.length + depositAddressMatches.length > 0,
      matches: [...chainResult.matches, ...depositAddressMatches],
      depositAddressLookupUnavailable: depositAddressMatchesByAddress[index] === null,
    });
  }
  
  return {
    results,
    totalAddresses: addresses.length,
    validAddressCount: validAddresses.length,
    invalidAddresses,
  };
}
