// utils/walletUtils.js
import { verifyMessage } from "ethers";

function verifySignature(message, signature) {
  try {
    const recovered = verifyMessage(message, signature);
    return recovered;
  } catch (err) {
    console.error("Signature verification failed:", err);
    return null;
  }
}

export { verifySignature };
