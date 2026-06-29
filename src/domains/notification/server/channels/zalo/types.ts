export type ZaloSendTextToGroupInput = {
    groupId: string;
    message: string;
};

export type ZaloApiResponse = {
    error?: number | string;
    message?: string;
    error_description?: string;
    data?: any;
};