import { Prisma, AcquisitionType } from "@prisma/client";

export type CreateAcqDTO = {
    vendorId: string;
    acquiredAt?: string | Date | null;
    cost?: number | null;
    currency?: string | null;
    refNo?: string | null;
    notes?: string | null;
    type?: AcquisitionType | "PURCHASE" | "CONSIGN";
};

