import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

const app = express()

app.use(morgan("dev"));
app.use(cookieParser());

app.get("/health", (req, res) => {
    return res.json({
        success: true
    });
});

export default app;