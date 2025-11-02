import mongoose from 'mongoose';
import { getAddress } from 'ethers';

const UserSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        try {
          getAddress(v);
          return true;
        } catch (e) {
          return false;
        }
      },
      message: 'Invalid Ethereum address'
    }
  },
  AadharNumber: {
    type: String,
    required: true,
    unique: true
  },
  aesKeyEncrypted: {
    type: String,
    required: true
  },
  nftTokenId: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', UserSchema);
export default User;
