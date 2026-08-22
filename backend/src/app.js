import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import hpp from 'hpp';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import router from './routes/index.js';
import errorMiddleware from './middlewares/error.middleware.js';
import cors from 'cors';
import env from './config/env.config.js';

const app = express();
const allowedOrigins = env.CORS_FRONTNED_URL.split(",");

app.use(morgan("dev"));
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
}));
app.set("trust proxy", 1);
app.use(cookieParser());
app.use(express.json({ limit: "10kb" }));       
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(hpp());
app.use(helmet());
app.use(compression());                          

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: "Too many requests, please try again later." },
});
app.use("/api/v1", limiter);

app.use("/api/v1", router);

app.get("/health", (req, res) => {
    res.json({ success: true, uptime: process.uptime(), timestamp: Date.now() });
});

app.use((req, res) => {
    res.status(404).json({ success: false, message: "Route not found" });
});

app.use(errorMiddleware);

export default app;