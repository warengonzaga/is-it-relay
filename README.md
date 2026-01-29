# Is It Relay?

A web app to detect if a wallet address is part of [Relay Protocol](https://relay.link) infrastructure. Checks solver addresses and v2 depository contracts across all supported chains.

[![Deploy to GitHub Pages](https://github.com/warengonzaga/is-it-relay/actions/workflows/deploy.yml/badge.svg)](https://github.com/warengonzaga/is-it-relay/actions/workflows/deploy.yml)

## Features

- **Address Detection** — Identifies solver addresses and v2 depository contracts from the Relay Protocol API.
- **Multi-chain Support** — Scans across all chains returned by the `/chains` endpoint.
- **EVM & SVM** — Supports both EVM (`0x...`) and Solana (base58) addresses.
- **Detection Summary** — Shows match type (solver, depository, or both) with per-chain breakdown.
- **Collapsible Chain Lists** — Solver and depository matches grouped separately with expandable details.
- **Block Explorer Links** — Direct links to view the address on each chain's explorer.
- **Shareable URLs** — Results are linkable via `?address=` query parameter.
- **Wallet Privacy** — Address visibility toggle with truncated display by default.
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

1. User enters an EVM or Solana wallet address.
2. The app fetches all chains from `https://api.relay.link/chains`.
3. For each chain, it checks:
   - `solverAddresses[]` — solver wallet addresses
   - `protocol.v2.depository` — v2 depository contract address
4. Matching uses case-insensitive comparison for EVM and exact match for SVM (base58 is case-sensitive).
5. Results display the match type, matched chains, and explorer links.

## Project Structure

```
src/
├── components/
│   ├── ui/              # Reusable UI primitives (Button, Card, Input)
│   ├── AddressInput.tsx  # Address input form with validation
│   ├── DetectionResult.tsx # Result display with chain details
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

MIT © [Waren Gonzaga](https://github.com/warengonzaga)
