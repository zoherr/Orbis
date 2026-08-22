import amqp from "amqplib";
import env from "../config/env.config.js";

let connection;
let channel;

export const connectRabbitMQ = async () => {
    connection = await amqp.connect(
        env.RABBITMQ_URL || "amqp://localhost"
    );

    channel = await connection.createChannel();

    console.log("RabbitMQ connected");

    return channel;
};

export const createQueue = async (queueName) => {
    if (!channel) {
        throw new Error("RabbitMQ is not connected");
    }

    await channel.assertQueue(queueName, {
        durable: true
    });
};

export const sendToQueue = async (queueName, message) => {
    if (!channel) {
        throw new Error("RabbitMQ is not connected");
    }

    await channel.assertQueue(queueName, {
        durable: true
    });

    return channel.sendToQueue(
        queueName,
        Buffer.from(JSON.stringify(message)),
        {
            persistent: true
        }
    );
};

export const consumeQueue = async (queueName, callback) => {
    if (!channel) {
        throw new Error("RabbitMQ is not connected");
    }

    await channel.assertQueue(queueName, {
        durable: true
    });

    await channel.consume(queueName, async (message) => {
        if (!message) return;

        try {
            const data = JSON.parse(
                message.content.toString()
            );

            await callback(data);

            channel.ack(message);
        } catch (error) {
            console.error(error);

            channel.nack(message, false, true);
        }
    });
};

export const getChannel = () => channel;

export const disconnectRabbitMQ = async () => {
    try {
        if (channel) {
            await channel.close();
        }
        if (connection) {
            await connection.close();
        }
        console.log("RabbitMQ disconnected");
    } catch (error) {
        console.error("RabbitMQ disconnect error:", error);
    }
};

export default {
    connectRabbitMQ,
    createQueue,
    sendToQueue,
    consumeQueue,
    getChannel,
    disconnectRabbitMQ
};