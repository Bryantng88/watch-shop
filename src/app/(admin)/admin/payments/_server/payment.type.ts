import { PaymentMethod, PaymentStatus, PaymentPurpose } from "@prisma/client";
import { Prisma } from "@prisma/client";

export type CreatePaymentInput = {
    method: any; // PaymentMethod
    amount: Prisma.Decimal;
    currency: string;

    paidAt?: Date | null; // default(now) nhưng set cũng ok
    reference?: string | null;
    note?: string | null;

    direction: any; // paymentdirection?
    status: any; // PaymentStatus
    purpose: any; // PaymentPurpose
    type: any; // PaymentType

    order_id?: string | null;
    service_request_id?: string | null;
    vendor_id?: string | null;
    acquisition_id?: string | null;
    shipment_id?: string | null;
};