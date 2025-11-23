import lighthouse from '@lighthouse-web3/sdk';
import fs from 'fs';
import path from 'path';
import os from 'os';

// upload file to lighthouse, returns { data: { Hash: 'Qm...' } }
async function uploadFileToLighthouse(buffer, filename) {

    try {
        // Write buffer to a temporary file
        const tempDir = os.tmpdir();
        const tempFilePath = path.join(tempDir, filename);
        fs.writeFileSync(tempFilePath, buffer);

        const response = await lighthouse.upload(tempFilePath, process.env.LIGHTHOUSE_API_KEY);

        // Clean up temp file
        fs.unlinkSync(tempFilePath);

        return response.data.Hash;
    }
    catch (err) {
        console.error("Lighthouse upload error:", err);
        throw err;
    }



}


async function uploadJSONToLighthouse(jsonObj, filename) {
    const buffer = Buffer.from(JSON.stringify(jsonObj));
    return await uploadFileToLighthouse(buffer, filename);
}

export { uploadFileToLighthouse, uploadJSONToLighthouse };
