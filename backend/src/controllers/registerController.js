import User from '../models/User.js';
import { generateAESKey, encryptWithAES, encryptAESKeyWithMaster, sha256Hex } from '../utils/cryptoUtils.js';
import { uploadFileToLighthouse, uploadJSONToLighthouse } from '../config/lighthouse.js';
import { verifySignature } from '../utils/walletUtils.js';
import { contract } from '../config/blockchain.js';
import crypto from 'crypto';

export const registerUser = async (req, res) => {
    try {
        const { walletAddress, signature, message, embedding, profile, AadharNumber } = req.body;
        if (!walletAddress || !signature || !message || !embedding || !profile || !AadharNumber) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Input validation
        if (typeof walletAddress !== 'string' || !/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
            return res.status(400).json({ error: 'Invalid wallet address format' });
        }
        if (typeof message !== 'string' || message.length === 0) {
            return res.status(400).json({ error: 'Invalid message' });
        }
        if (typeof signature !== 'string' || !/^0x[a-fA-F0-9]{130}$/.test(signature)) {
            return res.status(400).json({ error: 'Invalid signature format' });
        }
        if (!Array.isArray(embedding) || embedding.length === 0 || !embedding.every(e => typeof e === 'number')) {
            return res.status(400).json({ error: 'Invalid embedding format' });
        }
        if (typeof profile !== 'object' || profile === null) {
            return res.status(400).json({ error: 'Invalid profile format' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ AadharNumber });
        if (existingUser) {
            return res.status(400).json({ error: 'User already registered' });
        }

        // wallet already registered check
        const existingWallet = await User.findOne({ walletAddress });   
        if (existingWallet) {
            return res.status(400).json({ error: 'Wallet address already registered' });
        }
        
        // Verify wallet signature with nonce
        const recovered = verifySignature(message, signature);
        if (!recovered || recovered.toLowerCase() !== walletAddress.toLowerCase()) {
            return res.status(400).json({ error: 'Wallet signature mismatch' });
        }


        // 2. parse embedding (assume base64 or JSON array)
        // If embedding is base64 string:
        let embeddingBuffer;
        if (typeof embedding === 'string') {
            embeddingBuffer = Buffer.from(embedding, 'base64');
        } else {
            // if it's an array of numbers, convert to Buffer (Float32)
            const arr = embedding; // e.g., [0.12,0.3,...]
            const floatBuf = Buffer.from(Float32Array.from(arr).buffer);
            embeddingBuffer = floatBuf;
        }

        //3. Generate AES key and encrypt profile data
        const aesKey = generateAESKey();
        //encrypt the embedding with the same AES key
        const encryptedEmbedding = encryptWithAES(aesKey, embeddingBuffer);
        const encryptedProfile = encryptWithAES(aesKey, Buffer.from(JSON.stringify(profile)));


        //4. Upload encrypted profile and encrypted embedding to IPFS
        const profileFileName = `${walletAddress}_profile.json.enc`;
        const profileCID = await uploadFileToLighthouse(Buffer.from(JSON.stringify(encryptedProfile)), profileFileName);
        console.log('Profile uploaded to IPFS with CID:', profileCID);

        const embeddingFileName = `${walletAddress}_embedding.enc`;
        const biometricCID = await uploadFileToLighthouse(Buffer.from(JSON.stringify(encryptedEmbedding)), embeddingFileName);
        console.log('Embedding uploaded to IPFS with CID:', biometricCID);

        // 5. compute commitment hash (hash of raw embedding)
        const commitmentHash = sha256Hex(embeddingBuffer);

        // 6. prepare NFT metadata and upload
        const timestamp = new Date().toISOString();
        const nftMetadata = {
            name: `soulboundNft - ${walletAddress}`,
            description: 'soulbount NFT for identity verification',
            attributes: [
                { trait_type: 'BiometricCID', value: biometricCID },
                { trait_type: 'ProfileCID', value: profileCID },
                { trait_type: 'CommitmentHash', value: commitmentHash },
                { trait_type: 'RegisteredAt', value: timestamp }
            ]
        };

        const metadataCID = await uploadJSONToLighthouse(nftMetadata, `${walletAddress}_metadata.json`);
        console.log('Metadata uploaded to IPFS with CID:', metadataCID);
        const tokenURI = `ipfs://${metadataCID}`;

        // 7. encrypt AES key with master & store in DB
        const aesKeyEncryptedObj = encryptAESKeyWithMaster(aesKey, process.env.MASTER_KEY);

        // 8.store the walletAddress and aesKeyEncryptedObj in DB
        const userDoc = await User.create({
            walletAddress,
            AadharNumber,
            aesKeyEncrypted: JSON.stringify(aesKeyEncryptedObj),
        });


        // 9. mint NFT (backend signer mints)
        // 1. Mint the NFT to the user's wallet
        const tx = await contract.mintSoulbound(walletAddress, tokenURI);
        console.log("Transaction hash:", tx.hash);

        // 2. Wait for the transaction to be mined
        const receipt = await tx.wait();
        console.log("Transaction mined. Block number:", receipt.blockNumber);

        const transferEvent = receipt.logs.map(log => {
            try {
                return contract.interface.parseLog(log);
            }
            catch (err) {
                return null;
            }
        }).filter(e => e && e.name === 'Transfer')[0];

        const tokenId = transferEvent.args.tokenId.toString();
        console.log(`NFT minted with Token ID: ${tokenId}`);


        // update DB with tokenId (optional)
        userDoc.nftTokenId = tokenId;
        await userDoc.save();

        return res.status(200).json({
            message: 'Registered & NFT minted',
            tokenId,
            transactionHash: tx.hash
        });


    }
    catch (err) {
        console.error('register error:', err.message);
        return res.status(500).json({ error: 'Internal server error' });
    }
};