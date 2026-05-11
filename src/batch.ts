import { BasenameResolver } from "./resolver";
export async function batchResolveWithFallback(names: string[], rpc: string): Promise<Array<{name: string, address: string | null, avatar: string | null}>> {
  const resolver = new BasenameResolver({ rpc, cacheTTL: 600_000 });
  return Promise.all(names.map(async name => ({
    name, address: await resolver.resolve(name), avatar: await resolver.getAvatar(name)
  })));
}
export function formatBasename(address: string, name: string | null): string {
  return name ?? `${address.slice(0, 6)}...${address.slice(-4)}`;
}
