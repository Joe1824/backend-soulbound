import axios from 'axios';
import User from '../models/User.js';
import { decryptAESKeyWithMaster, decryptWithAES } from '../utils/cryptoUtils.js';
import { contract } from '../config/blockchain.js';
import { verifySignature } from '../utils/walletUtils.js';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

// Cosine similarity helper
const cosineSimilarity = (a, b) => {
    const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const normA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const normB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    return dotProduct / (normA * normB);
};

export const authenticateUser = async (req, res) => {
    try {
        const { walletAddress, signature, message, embedding, requireProfile } = req.body;
        if (!walletAddress || !embedding || !signature || !message) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
    
        // Input validation
        if (typeof walletAddress !== 'string' || !/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
            return res.status(400).json({ error: 'Invalid wallet address format' });
        }
        if (!Array.isArray(embedding) || embedding.length === 0 || !embedding.every(e => typeof e === 'number')) {
            return res.status(400).json({ error: 'Invalid embedding format' });
        }
        if (signature && (typeof signature !== 'string' || !/^0x[a-fA-F0-9]{130}$/.test(signature))) {
            return res.status(400).json({ error: 'Invalid signature format' });
        }
        if (message && typeof message !== 'string') {
            return res.status(400).json({ error: 'Invalid message format' });
        }

        // Find user
        const user = await User.findOne({ walletAddress });
        if (!user) return res.status(404).json({ authenticated: false, error: 'User not found' });

        // Verify ownership if signature provided
        if (signature && message) {
            const recovered = verifySignature(message, signature);
            if (!recovered || recovered.toLowerCase() !== walletAddress.toLowerCase()) {
                return res.status(403).json({ authenticated: false, error: 'Signature verification failed' });
            }
        }

        // Fetch metadata from NFT
        const tokenId = user.nftTokenId;
        const tokenURI = await contract.tokenURI(tokenId);
        const metadataURL = tokenURI.replace('ipfs://', 'https://gateway.lighthouse.storage/ipfs/');
        const { data: metadata } = await axios.get(metadataURL);

        // Extract CIDs from metadata attributes
        const biometricAttr = metadata.attributes.find(a => a.trait_type === 'BiometricCID');
        const profileAttr = metadata.attributes.find(a => a.trait_type === 'ProfileCID');
        const storedEmbeddingCID = biometricAttr?.value;
        const profileCID = profileAttr?.value;

        if (!storedEmbeddingCID) {
            return res.status(500).json({ authenticated: false, error: 'Biometric data not found in NFT metadata' });
        }

        // Fetch encrypted embedding
        const storedEmbeddingResponse = await axios.get(`https://gateway.lighthouse.storage/ipfs/${storedEmbeddingCID}`, { responseType: 'json' });
        const storedEmbeddingEnc = storedEmbeddingResponse.data;

        // Decrypt AES key and embedding
        const aesKeyEncryptedObj = JSON.parse(user.aesKeyEncrypted);
        const aesKey = decryptAESKeyWithMaster(aesKeyEncryptedObj, process.env.MASTER_KEY);
        const storedEmbeddingBuffer = decryptWithAES(aesKey, storedEmbeddingEnc);
        const storedEmbeddingArray = new Float32Array(storedEmbeddingBuffer.buffer, storedEmbeddingBuffer.byteOffset, storedEmbeddingBuffer.length / 4);

        // Parse provided embedding
        const providedEmbeddingArray = typeof embedding === 'string'
            ? new Float32Array(Buffer.from(embedding, 'base64').buffer)
            : Float32Array.from(embedding);

        // Compare embeddings
        const similarity = cosineSimilarity(storedEmbeddingArray, providedEmbeddingArray);
        const THRESHOLD = parseFloat(process.env.SIMILARITY_THRESHOLD) || 0.8;

        if (similarity < THRESHOLD) {
            return res.status(200).json({ authenticated: false });
        }

        // Optionally fetch and decrypt profile
        let profile = undefined;
        if (requireProfile && profileCID) {
            const profileResponse = await axios.get(`https://gateway.lighthouse.storage/ipfs/${profileCID}`, { responseType: 'json' });
            const profileEnc = profileResponse.data;
            const decryptedProfileBuffer = decryptWithAES(aesKey, profileEnc);
            profile = JSON.parse(decryptedProfileBuffer.toString());
        }
        console.log("similarity:", similarity);
        return res.status(200).json({ authenticated: true, walletAddress, profile });
    }
    catch (error) {
        console.error('Error in authenticateUser:', error.message);
        return res.status(500).json({ authenticated: false, error: 'Internal server error' });
    }
};
