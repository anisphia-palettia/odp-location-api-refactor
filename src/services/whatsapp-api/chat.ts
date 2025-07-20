import whatsappApiClient from "@/services/whatsapp-api-client";
import BasePath from "@/services/whatsapp-api/base-path";
import {EnvConfig} from "@/config/env.config";
import {WhatsAppChat, WhatsAppResponse} from "@/types/whatsapp-api";

export async function groupChats() {
    const response = await whatsappApiClient.get<WhatsAppResponse<WhatsAppChat[]>>(`${BasePath.chats}/group`, {
        params: {sessionId: EnvConfig.SESSION_ID}
    });
    return response.data;
}

export async function groupByChatId(chatId: string) {
    const response = await whatsappApiClient.get<WhatsAppResponse<WhatsAppChat>>(`${BasePath.chats}/${chatId}`, {
        params: {sessionId: EnvConfig.SESSION_ID}
    })
    return response.data;
}