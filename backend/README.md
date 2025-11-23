# NFT Backend API

This is the backend API for an NFT platform, built with Node.js and Express. It handles user authentication, registration, and integration with blockchain and decentralized storage.

## Features

- User registration and authentication using wallet signatures
- Rate limiting for API endpoints
- MongoDB integration for user data storage
- Integration with Lighthouse for decentralized file storage
- Support for ERC721 Soulbound NFTs
- Environment-based configuration

## Installation

1. Clone the repository and navigate to the backend directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/nft-backend
   JWT_SECRET=your-jwt-secret
   RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
   PRIVATE_KEY=your-private-key
   CONTRACT_ADDRESS=your-deployed-contract-address
   LIGHTHOUSE_API_KEY=your-lighthouse-api-key
   SIMILARITY_THRESHOLD=0.8
   ```
4. Ensure MongoDB is running locally or update `MONGODB_URI` to your database URL.

## Usage

### Development

```bash
npm run dev
```

### Production

```bash
npm start
```

The server will start on the port specified in `.env` (default: 5000).

## API Endpoints

### POST /api/register

Register a new user with wallet address and profile data.

**Request Body:**

```json
{
  "walletAddress": "0x...",
  "profile": {
    "name": "User Name",
    "email": "user@example.com"
  },
  "embedding": [0.1, 0.2, ...],
  "signature": "0x...",
  "nonce": "random-nonce"
}
```

### POST /api/verify

Authenticate a user with wallet signature.

**Request Body:**

```json
{
  "walletAddress": "0x...",
  "embedding": [0.1, 0.2, ...],
  "signature": "0x...",
  "nonce": "random-nonce"
}
```

## Project Structure

- `src/app.js`: Express app configuration and middleware
- `src/server.js`: Server startup and database connection
- `src/routes/`: API route definitions
- `src/controllers/`: Request handlers for authentication and registration
- `src/models/`: MongoDB schemas
- `src/config/`: Configuration files for database, blockchain, and Lighthouse
- `src/utils/`: Utility functions for crypto and wallet operations

## Dependencies

- Express: Web framework
- Mongoose: MongoDB ODM
- Ethers: Ethereum library
- Lighthouse SDK: Decentralized storage
- CORS: Cross-origin resource sharing
- Body-parser: Request body parsing
- Express-rate-limit: API rate limiting
- Dotenv: Environment variable management

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

ISC
