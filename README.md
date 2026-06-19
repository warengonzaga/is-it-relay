# Is It Relay?

A web app to detect if an address is part of [Relay Protocol](https://relay.link) infrastructure or a Relay deposit-address request. Checks solver addresses, depository contracts, protocol contracts, and matching deposit-address records across all supported chains.

[![Deploy to GitHub Pages](https://github.com/warengonzaga/is-it-relay/actions/workflows/deploy.yml/badge.svg)](https://github.com/warengonzaga/is-it-relay/actions/workflows/deploy.yml)

## Features

- **Address Detection** — Identifies solver addresses, depository contracts, protocol contracts (multicall, routers, receivers, etc.), and Relay deposit-address requests from the Relay Protocol API.
- **Batch Processing** — Check multiple addresses at once by pasting comma, newline, or space-separated lists.
- **Multi-chain Support** — Scans across all chains returned by the `/chains` endpoint.
- **EVM, SVM & BTC** — Supports EVM (`0x...`), Solana (base58), and Bitcoin (Legacy, SegWit, Taproot) addresses.
- **Detection Summary** — Shows match type (solver, depository, contract, deposit address) with per-chain and per-request breakdown.
- **Collapsible Chain Lists** — Matches grouped by type with expandable details.
- **Block Explorer Links** — Direct links to view the address on each chain's explorer.
- **Shareable URLs** — Results are linkable via `?address=` query parameter.
- **Privacy Toggle** — Address visibility toggle with truncated display by default.
- **Pixel Avatars** — Unique pixel-based avatars generated per address.

## Tech Stack

- [React 19](https://react.dev/) with [TypeScript](https://www.typescriptlang.org/)
- [Vite 7](https://vite.dev/)
- [Tailwind CSS 3](https://tailwindcss.com/)
- [Axios](https://axios-http.com/)
- [Boring Avatars](https://boringavatars.com/)
- [Lucide React](https://lucide.dev/)
- [Relay API](https://api.relay.link)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [pnpm](https://pnpm.io/)

### Installation

```bash
git clone https://github.com/warengonzaga/is-it-relay.git
cd is-it-relay
pnpm install
```

### Environment Variables

Optional: set `VITE_RELAY_API_KEY` in your environment for higher Relay API rate limits when checking deposit-address requests.

For local development, you can place it in a `.env` file:

```bash
VITE_RELAY_API_KEY=your-relay-api-key
```

### Development

```bash
pnpm dev
```

### Build

```bash
pnpm build
```

### Preview

```bash
pnpm preview
```

## How It Works

1. User enters one or multiple EVM, Solana, or Bitcoin addresses (comma, newline, or space-separated).
2. The app fetches all chains from `https://api.relay.link/chains`.
3. It also queries `https://api.relay.link/requests/v2?depositAddress=<address>&includeChildRequests=true` to detect Relay deposit-address requests.
4. For each chain, it checks:
   - `solverAddresses[]` — solver addresses
   - `protocol.v2.depository` — v2 depository contract address
   - `contracts.*` — protocol contracts (multicall3, erc20Router, relayReceiver, etc.)
5. Matching uses case-insensitive comparison for EVM and exact match for SVM/BTC (base58/bech32 is case-sensitive).
6. Results display the match type, matched chains, deposit-request metadata, and explorer links.
7. For batch processing, results are organized by detected and non-detected addresses with summary statistics.

## Project Structure

```
src/
├── components/
│   ├── ui/              # Reusable UI primitives (Button, Card, Input, Textarea)
│   ├── AddressInput.tsx  # Address input form with validation
│   ├── DetectionResult.tsx # Result display with chain details
│   ├── BatchDetectionResult.tsx # Batch results display with summary
│   ├── Footer.tsx        # Footer with repo links
│   └── IsItRelayLogo.tsx # Custom logo component
├── services/
│   └── relayApi.ts       # API client and detection logic
├── types/
│   └── relay.ts          # TypeScript interfaces
├── lib/
│   └── utils.ts          # Utility functions
├── App.tsx               # Main app component
├── main.tsx              # Entry point
└── index.css             # Global styles and theme
```

## License

GPL-3.0 © [Waren Gonzaga](https://github.com/warengonzaga)
