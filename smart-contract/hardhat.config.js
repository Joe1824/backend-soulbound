require("@nomicfoundation/hardhat-ethers");
require("dotenv").config();

const { RPC_URL, PRIVATE_KEY } = process.env;

module.exports = {
  solidity: "0.8.20",
  networks: {
    hardhat: {}, // local network
    sepolia: {
      url: RPC_URL,             // Infura/Alchemy RPC URL
      accounts: [PRIVATE_KEY],  // Your MetaMask private key
    },
  },
};
