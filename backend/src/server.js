import app from "./app.js"
import env from "./config/env.config.js"
import connectDb from "./lib/connectDb.js";
import { connectRabbitMQ } from "./lib/rabbitmq.js";
import { initWebSocketServer } from "./socket/index.js";



const startServer = async () => {
    try {
        await connectRabbitMQ();
        await connectDb()
        const server = app.listen(env.PORT,"0.0.0.0", () => {
            console.log(`SERVER IS RUNNING ON PORT:${env.PORT}`);
        });
        
        initWebSocketServer(server);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

startServer();