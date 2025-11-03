# TODO: Fix NFT Backend Authentication Issues

## Pending Tasks

- [x] Update package.json: Remove web3, add express-rate-limit
- [x] Update src/utils/walletUtils.js: Modify verifySignature to accept and use nonce
- [x] Update src/models/User.js: Add validation for walletAddress (Ethers checksum)
- [x] Update src/controllers/registerController.js: Fix bitwise OR to tokenId, add nonce to signature verification, add input validation (embedding format, profile structure), sanitize error responses
- [x] Update src/controllers/authenticationController.js: Add missing contract import, change contract calls to Ethers syntax, add signature verification with nonce, add input validation, make similarity threshold configurable via env, sanitize error responses and logs
- [x] Update src/routes/Routes.js: Add rate limiting to routes
- [x] Update src/app.js: Add rate limiting middleware setup

## Followup Steps

- [x] Install new dependencies (npm install)
- [x] Test endpoints with basic requests to verify fixes
- [x] Check for any runtime errors or missing env vars
