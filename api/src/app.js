import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import hpp from 'hpp';
import helmet from 'helmet';
import router from './routes/index.js';
import errorMiddleware from './middlewares/error.middleware.js'

const app = express()

app.use(morgan("dev"));
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