import { Wallet } from "ethers";
import dotenv from "dotenv";
dotenv.config();

// put PRIVATE_KEY=0x... in your .env (local only)
const wallet = new Wallet(process.env.PRIVATE_KEY);

async function main() {
  const message = "Registering soulbound identity: nonce:abc123:" + Date.now();
  const signature = await wallet.signMessage(message);
  console.log("Address:", wallet.address);
  console.log("Message:", message);
  console.log("Signature:", signature);
}

main().catch(console.error);
