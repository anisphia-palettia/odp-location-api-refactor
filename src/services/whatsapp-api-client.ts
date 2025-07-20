import axios, {AxiosError} from "axios";
import {EnvConfig} from "@/config/env.config";
import {logger} from "@/lib/logger";

const whatsappApiClient = axios.create({
    baseURL: EnvConfig.WHATSAPP_SERVICE_URL,
    timeout: 20000,
    validateStatus: () => true,
});

whatsappApiClient.interceptors.request.use(
    (config) => {
        logger.info({
            method: config.method?.toUpperCase(),
            url: `${config.baseURL}${config.url}`,
            headers: config.headers,
            params: config.params,
            data: config.data,
        }, `[WHATSAPP-API-CLIENT] REQUEST`);
        return config;
    },
    (error: AxiosError) => {
        logger.error({
            message: error.message,
            config: error.config,
            stack: error.stack,
            code: error.code,
        }, `[WHATSAPP-API-CLIENT] REQUEST ERROR`);
        return Promise.reject(error);
    }
);

whatsappApiClient.interceptors.response.use(
    (response) => {
        logger.info({
            method: response.config.method?.toUpperCase(),
            url: `${response.config.baseURL}${response.config.url}`,
            status: response.status,
            // data: response.data,
        }, `[WHATSAPP-API-CLIENT] RESPONSE`);
        return response;
    },
    (error: AxiosError) => {
        logger.error({
            message: error.message,
            config: error.config,
            stack: error.stack,
            code: error.code,
            response: error.response?.data,
            status: error.response?.status,
        }, `[WHATSAPP-API-CLIENT] RESPONSE ERROR`);
        return Promise.reject(error);
    }
);

export default whatsappApiClient;
