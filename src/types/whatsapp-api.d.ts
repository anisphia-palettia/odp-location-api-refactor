export interface WhatsAppChat {
    id: string;
    sessionId: string;
    name: string;
    isGroup: boolean;
    unreadCount: number;
    createdAt: string;
    updatedAt: string;
}

export interface WhatsAppResponse<T = any> {
    success: boolean;
    origin: string;
    statusCode: number;
    message: string;
    data?: T
}
