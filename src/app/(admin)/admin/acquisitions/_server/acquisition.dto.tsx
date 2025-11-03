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

export type CreateAcqWithItemInput = {
    vendorId: string;
    currency?: string;            // mặc định "VND"
    type?: AcquisitionType;       // mặc định "PURCHASE"
    acquiredAt?: Date;
    notes?: string | null;

    // tuỳ chọn: chính sách reuse phiếu DRAFT
    reuse?: "always-new" | "reuse-today" | "reuse-latest";

    item: {
        productId: string;
        variantId?: string | null;
        quantity: number;           // mặc định 1 (nếu muốn)
        unitCost: number;           // hoặc string nếu bạn dùng Decimal
    };
};