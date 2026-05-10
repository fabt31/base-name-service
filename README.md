# base-name-service

> Basename Resolution Tools for Base L2

Utilities for working with Basenames (.base.eth) on Base L2. Resolve names to addresses, reverse lookup addresses to names, batch resolve, and integrate Basenames into your dApp.

## Features
- 🔍 Forward resolution: `name.base.eth` → address
- 🔄 Reverse lookup: `0xAddress` → name
- 📦 Batch resolution (multiple names in one call)
- 🖼️ Avatar / profile metadata fetcher
- ⚡ Cached resolution with TTL
- 🔗 ENS-compatible (works with standard ENS libraries)

## Installation
```bash
npm install base-name-service
# or
git clone https://github.com/fabt31/base-name-service
npm install
```

## Usage
```typescript
import { BasenameResolver } from "./src/resolver";

const resolver = new BasenameResolver({ rpc: "https://mainnet.base.org" });

// Forward resolve
const address = await resolver.resolve("vitalik.base.eth");
// → "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"

// Reverse lookup
const name = await resolver.reverseLookup("0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045");
// → "vitalik.base.eth"

// Batch resolve
const results = await resolver.resolveBatch(["alice.base.eth", "bob.base.eth"]);
```

## Basenames Contract Addresses (Base)
- L2 Resolver: `0xC6d566A56A1aFf6508b41f6c90ff131615583BCD`
- Registrar: `0x4cCb0BB02FCABA27e82a56646E81d8c5bC4119a9`

## License
MIT