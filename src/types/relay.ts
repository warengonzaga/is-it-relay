export interface ChainProtocolV2 {
  chainId: string;
  depository: string;
}

export interface ChainProtocol {
  v2?: ChainProtocolV2;
}

// Contracts structure - supports nested objects like v3.erc20Router
export interface ChainContracts {
  [key: string]: string | { [key: string]: string };
}

export interface RelayChain {
  id: number;
  name: string;
  displayName: string;
  explorerUrl: string;
  iconUrl: string;
  solverAddresses: string[];
  protocol?: ChainProtocol;
  vmType: string;
  contracts?: ChainContracts;
}

// Base interface for all address matches
export interface BaseAddressMatch {
  chainId: number;
  chainName: string;
  chainDisplayName: string;
  explorerUrl: string;
  iconUrl: string;
  address: string;
}

export interface SolverMatch extends BaseAddressMatch {
  matchType: 'solver';
}

export interface DepositoryMatch extends BaseAddressMatch {
  matchType: 'depository';
}

export interface ContractMatch extends BaseAddressMatch {
  matchType: 'contract';
  contractType: string;
}

export type AddressMatch = SolverMatch | DepositoryMatch | ContractMatch;

export interface DetectionResult {
  isRelay: boolean;
  address: string;
  matches: AddressMatch[];
}
