export type ZaloSendTextToGroupInput = {
    groupId: string;
    message: string;
};

export type ZaloApiResponse = {
    error?: number | string;
    error_code?: number | string;
    message?: string;
    error_description?: string;
    data?: unknown;
};

export type ZaloTokenResponse = {
    access_token?: string;
    refresh_token?: string;
    expires_in?: number | string;
    error?: number | string;
    error_code?: number | string;
    message?: string;
    error_description?: string;
};
