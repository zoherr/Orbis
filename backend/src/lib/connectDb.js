import mongoose from "mongoose";
import env from "../config/env.config.js";

const connectDb = async () => {
    try {
        
        await mongoose.connect(env.DATABASE_URL).then(() => {
            console.log("Database Connected Successfully.")
        });

    } catch (error) {
        console.error("Database error: ", error);
    }
}

export const disconnectDb = async () => {
    try {
        await mongoose.disconnect();
        console.log("Database Disconnected Successfully.");
    } catch (error) {
        console.error("Database disconnect error: ", error);
    }
}

export default connectDb;