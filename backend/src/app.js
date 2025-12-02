import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import rateLimit from 'express-rate-limit';
import Routes from './routes/Routes.js';

const app = express();

app.set("trust proxy", 1);

// General rate limiting
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});
const allowedOrigins = ['http://localhost:5173','https://web3-app-demo.vercel.app','https://nftauth.vercel.app','https://soulboundregistration.vercel.app'];
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(generalLimiter);
app.use('/api', Routes);

export default app;
