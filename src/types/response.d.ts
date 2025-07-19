export type ResponseSuccess<T = any> = {
    success: boolean;
    origin?: string;
    data?: T;
    message: string;
    token?: string;
};

export type ResponseError = {
    success: boolean;
    origin?: string;
    error: {
        message: string;
        details?: any;
        stack?: string;
    };
};
