import { ethers } from 'ethers';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// load ABI from compiled contract artifact
const contractABIPath = path.resolve(__dirname, '../../../smart-contract/artifacts/contracts/SoulboundNFT.sol/SoulboundNFT.json');
const contractABI = JSON.parse(fs.readFileSync(contractABIPath, 'utf8')).abi;

const contractAddress = process.env.CONTRACT_ADDRESS;
const contract = new ethers.Contract(contractAddress, contractABI, wallet);

export { provider, wallet, contract };
