import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import hpp from 'hpp';
import helmet from 'helmet';
import router from './routes/index.js';
import errorMiddleware from './middlewares/error.middleware.js'
import cors from 'cors'
import env from './config/env.config.js';

const app = express()
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
app.use(express.json());
app.use(hpp());
app.use(helmet());

app.use("/api/v1", router);

app.get("/health", (req, res) => {
    return res.json({
        success: true
    });
});

app.use(errorMiddleware);

export default app;