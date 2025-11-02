// Sign.js
import { ethers } from 'ethers';

async function signMessage(message, privateKey) {
    const wallet = new ethers.Wallet(privateKey);
    const signature = await wallet.signMessage(message);
    return signature;
}

export { signMessage };
