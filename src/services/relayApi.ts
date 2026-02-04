import axios from 'axios';
import type { RelayChain, DetectionResult, AddressMatch } from '@/types/relay';

const RELAY_API_BASE = 'https://api.relay.link';

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
  const response = await axios.get<{ chains: RelayChain[] }>(`${RELAY_API_BASE}/chains`);
  return response.data.chains ?? response.data as unknown as RelayChain[];
}

function addressesMatch(a: string, b: string, vmType: string): boolean {
  if (vmType === 'svm' || vmType === 'bvm') {
    return a === b; // Case-sensitive for Solana and Bitcoin
  }
  return a.toLowerCase() === b.toLowerCase(); // Case-insensitive for EVM
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

export async function detectRelayAddress(address: string): Promise<DetectionResult> {
  const chains = await fetchChains();
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
