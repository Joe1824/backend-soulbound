import lighthouse from '@lighthouse-web3/sdk';
import dotenv from "dotenv";
dotenv.config();

const deleteFile = async () => {
  const file = [
    '24b15e96-52dd-4075-bb0c-493b723b26f3',
  ]

  for(const f of file){  
    const response = await lighthouse.deleteFile(
      process.env.LIGHTHOUSE_API_KEY,
      f
    );
    console.log(response);
  }

  
};

deleteFile();
