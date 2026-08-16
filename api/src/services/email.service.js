import { sendToQueue } from "../utils/rabbitmq.js";
import { QUEUES } from "../config/queues.config.js";

export const queueEmail = async ({
    to,
    subject,
    text,
    html,
    attachments
}) => {
    return sendToQueue(QUEUES.EMAIL, {
        to,
        subject,
        text,
        html,
        attachments
    });
};