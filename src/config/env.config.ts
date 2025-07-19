export const EnvConfig = {
    WHATSAPP_SERVICE_URL: process.env.WHATSAPP_SERVICE_URL || "",

    NODE_ENV: process.env.NODE_ENV || "development",
    APP_PORT: process.env.APP_PORT || 3000,

    DATABASE_URL: process.env.DATABASE_URL || "",

    SESSION_ID: process.env.SESSION_ID || "",
};