import {
    connectRabbitMQ,
    consumeQueue
} from "../lib/rabbitmq.js";

import sendMail from "../lib/mailer.js";
import { QUEUES } from "../config/queues.config.js";

const startEmailWorker = async () => {
    try {
        await connectRabbitMQ();

        await consumeQueue(
            QUEUES.EMAIL,
            async (email) => {
                console.log(
                    `Sending email to ${email.to}`
                );

                await sendMail(email);

                console.log(
                    `Email sent to ${email.to}`
                );
            }
        );

        console.log("Email worker started");
    } catch (error) {
        console.error(
            "Email worker failed:",
            error
        );

        process.exit(1);
    }
};

startEmailWorker();