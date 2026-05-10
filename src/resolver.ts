import { ethers } from "ethers";

const L2_RESOLVER = "0xC6d566A56A1aFf6508b41f6c90ff131615583BCD";
const RESOLVER_ABI = [
  "function addr(bytes32 node) view returns (address)",
  "function name(bytes32 node) view returns (string)",
  "function text(bytes32 node, string key) view returns (string)",
];
const REVERSE_REGISTRAR_ABI = [
  "function node(address addr) pure returns (bytes32)"
];

function namehash(name: string): string {
  let node = "0x" + "00".repeat(32);
  if (name === "") return node;
  const labels = name.split(".");
  for (let i = labels.length - 1; i >= 0; i--) {
    const labelHash = ethers.keccak256(ethers.toUtf8Bytes(labels[i]));
    node = ethers.keccak256(ethers.concat([ethers.getBytes(node), ethers.getBytes(labelHash)]));
  }
  return node;
}

export class BasenameResolver {
  private provider: ethers.JsonRpcProvider;
  private resolver: ethers.Contract;
  private cache: Map<string, { value: string; expiry: number }> = new Map();
  private ttl: number;

  constructor(config: { rpc: string; cacheTTL?: number }) {
    this.provider = new ethers.JsonRpcProvider(config.rpc);
    this.resolver = new ethers.Contract(L2_RESOLVER, RESOLVER_ABI, this.provider);
    this.ttl = config.cacheTTL ?? 300_000; // 5 min default
  }

  async resolve(name: string): Promise<string | null> {
    const cached = this.cache.get(name);
    if (cached && Date.now() < cached.expiry) return cached.value;
    try {
      const node = namehash(name);
      const address = await this.resolver.addr(node);
      if (address !== ethers.ZeroAddress) {
        this.cache.set(name, { value: address, expiry: Date.now() + this.ttl });
        return address;
      }
    } catch {}
    return null;
  }

  async reverseLookup(address: string): Promise<string | null> {
    const reverseNode = namehash(`${address.toLowerCase().slice(2)}.addr.reverse`);
    try {
      const name = await this.resolver.name(reverseNode);
      return name || null;
    } catch { return null; }
  }

  async resolveBatch(names: string[]): Promise<Record<string, string | null>> {
    const results = await Promise.all(names.map(n => this.resolve(n)));
    return Object.fromEntries(names.map((n, i) => [n, results[i]]));
  }

  async getAvatar(name: string): Promise<string | null> {
    try {
      const node = namehash(name);
      return await this.resolver.text(node, "avatar");
    } catch { return null; }
  }
}