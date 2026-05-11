import { ethers } from "ethers";
const REGISTRAR = "0x4cCb0BB02FCABA27e82a56646E81d8c5bC4119a9";
const REGISTRAR_ABI = [
  "function register((string name, address owner, uint256 duration, address resolver, bytes[] data, bool reverseRecord) request) payable",
  "function rentPrice(string name, uint256 duration) view returns (uint256)"
];
export async function registerBasename(name: string, wallet: ethers.Wallet, durationYears = 1) {
  const registrar = new ethers.Contract(REGISTRAR, REGISTRAR_ABI, wallet);
  const duration = durationYears * 365 * 24 * 3600;
  const price = await registrar.rentPrice(name, duration);
  console.log(`Registering ${name}.base.eth for ${ethers.formatEther(price)} ETH/year`);
  const tx = await registrar.register({ name, owner: wallet.address, duration, resolver: "0xC6d566A56A1aFf6508b41f6c90ff131615583BCD", data: [], reverseRecord: true }, { value: price });
  await tx.wait();
  console.log(`Registered! TX: ${tx.hash}`);
}
