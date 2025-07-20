export type WhatsAppWebhookMessage = {
    name: string;
    sessionId: string;
    chatId: string;
    messageId: string;
    fromMe: boolean;
    senderId: string;
    messageType: string;
    text: string;
    caption: string;
    mediaPath: string | null;
    timestamp: string;
    msg?: any;
};