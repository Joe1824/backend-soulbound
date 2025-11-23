import lighthouse from '@lighthouse-web3/sdk';
import dotenv from "dotenv";
dotenv.config();

async function listUploads() {
  try {
    const uploads = await lighthouse.getUploads(process.env.LIGHTHOUSE_API_KEY);
    console.log('Uploads:', uploads.data.fileList);
  } catch (err) {
    console.error('Error listing uploads:', err.response ? err.response.data : err.message);
  }
}

listUploads();

