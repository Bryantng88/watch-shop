import { PaymentMethod, PaymentStatus, PaymentPurpose } from "@prisma/client";



export type CreatePaymentInput = {
    orderId: string;
    amount: number;
    currency: string;
    purpose: PaymentPurpose;
    method: PaymentMethod;
    status: PaymentStatus
};
