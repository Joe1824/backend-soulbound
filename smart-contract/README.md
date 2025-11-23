# Soulbound NFT Smart Contract

This project contains a Soulbound NFT (Non-Fungible Token) smart contract built with Solidity and Hardhat. Soulbound NFTs are non-transferable tokens that represent unique identities or achievements.

## Features

- ERC721 compliant NFT contract
- Soulbound mechanism (non-transferable)
- URI storage for metadata
- Owner-only minting
- Event emission for minting

## Contract Details

The `SoulboundNFT` contract extends OpenZeppelin's ERC721URIStorage and Ownable contracts. It includes:

- `mintSoulbound(address to, string memory tokenURI)`: Mints a new soulbound NFT to the specified address with the given token URI
- Transfer prevention: Overrides `_update` to prevent any transfers after minting
- Event: `SoulboundMinted` emitted on successful minting

## Installation

1. Clone the repository and navigate to the smart-contract directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with the following variables:
   ```
   RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
   PRIVATE_KEY=your-metamask-private-key
   ```

## Usage

### Compile Contracts

```bash
npx hardhat compile
```

### Deploy to Sepolia Testnet

```bash
npm run deploy:sepolia
```

### Local Development

```bash
npx hardhat node
```

## Testing

Run tests (if implemented):

```bash
npx hardhat test
```

## Contract Address

After deployment, note the contract address for integration with the backend API.

## Project Structure

- `contracts/`: Solidity source files
- `scripts/`: Deployment scripts
- `artifacts/`: Compiled contract artifacts
- `cache/`: Hardhat cache files
- `hardhat.config.js`: Hardhat configuration

## Dependencies

- Hardhat: Ethereum development environment
- OpenZeppelin Contracts: Secure, tested smart contract libraries
- Hardhat Ethers: Ethereum library integration
- Dotenv: Environment variable management

## Security Considerations

- This contract is for demonstration purposes
- Soulbound NFTs prevent transfers, ensuring they remain with the original owner
- Only the contract owner can mint new tokens
- Use caution with private keys and RPC URLs

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT
