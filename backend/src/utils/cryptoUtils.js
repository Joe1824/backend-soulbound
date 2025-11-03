import crypto from 'crypto';

const AES_ALGO = 'aes-256-gcm'; // AES-GCM (authenticated encryption using galoi counter mode similar to mac (message authentication code) provides confidentiality and authentication)

// generate random AES key (32 bytes)
function generateAESKey() {
  return crypto.randomBytes(32); // Buffer
}

// encrypt data (utf8 string or Buffer) with given AES key
function encryptWithAES(aesKey, plaintext) {
  const iv = crypto.randomBytes(12); // 96-bit IV for GCM
  const cipher = crypto.createCipheriv(AES_ALGO, aesKey, iv);
  const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  const tag = cipher.getAuthTag();
  // return base64 pieces
  return {
    iv: iv.toString('base64'),
    ciphertext: ciphertext.toString('base64'),
    tag: tag.toString('base64')
  };
}

// decrypt AES-GCM
function decryptWithAES(aesKey, { iv, ciphertext, tag }) {
  const decipher = crypto.createDecipheriv(AES_ALGO, aesKey, Buffer.from(iv, 'base64'));
  decipher.setAuthTag(Buffer.from(tag, 'base64'));
  const decrypted = Buffer.concat([decipher.update(Buffer.from(ciphertext, 'base64')), decipher.final()]);
  return decrypted; // Buffer
}

// encrypt AES key with MASTER_KEY (server secret) using AES-256-GCM
function encryptAESKeyWithMaster(aesKeyBuffer, masterKeyBase64) {
  const masterKey = Buffer.from(masterKeyBase64, 'base64'); // expect 32-bytes
  return encryptWithAES(masterKey, aesKeyBuffer);
}

// decrypt AES key from DB with master key
function decryptAESKeyWithMaster(encryptedKeyObj, masterKeyBase64) {
  const masterKey = Buffer.from(masterKeyBase64, 'base64');
  const plainBuf = decryptWithAES(masterKey, encryptedKeyObj);
  return plainBuf; // Buffer of original AES key
}

// compute sha256 hex hash of raw embedding buffer
function sha256Hex(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

export {
  generateAESKey,
  encryptWithAES,
  decryptWithAES,
  encryptAESKeyWithMaster,
  decryptAESKeyWithMaster,
  sha256Hex
};
