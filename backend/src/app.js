import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import rateLimit from 'express-rate-limit';
import Routes from './routes/Routes.js';

const app = express();

app.set("trust proxy", 1);

// Allow everyone
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// General rate limiting
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(generalLimiter);

app.use('/api', Routes);

export default app;
