import nodemailer from "nodemailer";
import env from "../config/env.config.js";

const transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: Number(env.SMTP_PORT),
    secure: env.SMTP_SECURE === "true",
    auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS
    }
});

const sendMail = async (options = {}) => {
    return await transporter.sendMail({
        from: env.SMTP_FROM || env.SMTP_USER,
        ...options
    });
};

export default sendMail;