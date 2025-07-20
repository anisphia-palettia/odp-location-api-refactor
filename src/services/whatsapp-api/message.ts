import whatsappApiClient from "@/services/whatsapp-api-client";
import BasePath from "@/services/whatsapp-api/base-path";
import {EnvConfig} from "@/config/env.config";
import {WhatsAppWebhookMessage} from "@/types/whastapp-webhook";

export async function sendMessageText(text: string, recipient: string, msg: any) {
    const response = await whatsappApiClient.post(`${BasePath.message}/text`, {
        text,
        recipient,
        msg
    }, {params: {sessionId: EnvConfig.SESSION_ID, isToGroup: true}});
    return response.data;
}

export async function notifyRecipient(text: string, data: WhatsAppWebhookMessage) {
    await sendMessageText(text, data.msg.key.remoteJid!, data.msg)
}