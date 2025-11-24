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

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(generalLimiter);
app.use('/api', Routes);

export default app;
