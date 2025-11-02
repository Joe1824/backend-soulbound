// test.js
import { registerUser, authenticateUser } from './api.js';

const testData = {
  walletAddress: '0x8ab3E30abAD2ADbb939BAF34e9A6b72C6a3a9054',
  signature: '0x4522fc2f5f27ede9d47a4df4e02f747f924a85bcf56dcd871cc012e114fac5d01a0d4c7048d095944af6305405dab66334d5503619d8584e18e7e7d5f4f808ed1b',
  message: 'Registering soulbound identity: nonce:abc123:1762088490211',
  embedding: [0.12, 0.34, 0.56, 0.78],
  requireProfile: true,
};

async function testRegister() {
  try {
    const result = await registerUser(testData);
    console.log('Registration successful:', result);
  } catch (error) {
    console.error('Registration failed:', error.response.data);
  }
}

async function testAuthenticate() {
  try {
    const result = await authenticateUser(testData);
    console.log('Authentication successful:', result);
  } catch (error) {
    console.error('Authentication failed:', error.response.data);
  }
}

// Uncomment to run tests
// testRegister();
// testAuthenticate();
