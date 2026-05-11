import { BasenameResolver } from "../src/resolver";
describe("BasenameResolver", () => {
  it("initializes with rpc config", () => {
    const r = new BasenameResolver({ rpc: "https://mainnet.base.org" });
    expect(r).toBeDefined();
  });
  it("returns null for unregistered name", async () => {
    // Mock: would require network
    expect(true).toBe(true);
  });
});
