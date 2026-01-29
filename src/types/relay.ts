export interface ChainProtocolV2 {
  chainId: string;
  depository: string;
}

export interface ChainProtocol {
  v2?: ChainProtocolV2;
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
}

export interface AddressMatch {
  chainId: number;
  chainName: string;
  chainDisplayName: string;
  explorerUrl: string;
  iconUrl: string;
  matchType: 'solver' | 'depository';
  address: string;
}

export interface DetectionResult {
  isRelay: boolean;
  address: string;
  matches: AddressMatch[];
}
