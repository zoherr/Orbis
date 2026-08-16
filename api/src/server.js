import app from "./app.js"
import env from "./config/env.config.js"
import connectDb from "./lib/connectDb.js";
import { connectRabbitMQ } from "./utils/rabbitmq.js";



const startServer = async () => {
    try {
        await connectRabbitMQ();
        await connectDb()
        app.listen(env.PORT, () => {
            console.log(`SERVER IS RUNNING ON PORT:${env.PORT}`);
        });
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

startServer();