// src/features/aquisitions/server/acquisition.repo.ts
import { Prisma, AcquisitionType } from "@prisma/client";
import { Tx } from "@/server/db/client";


export const acquisitionRepo = (tx: Tx) => ({
    create: (data: {
        vendorId: string;
        acquiredAt?: string | Date | null;
        cost?: number | null;
        currency?: string | null;
        refNo?: string | null;
        notes?: string | null;
        type?: AcquisitionType | "PURCHASE" | "CONSIGN";
    }) => {
        const at =
            typeof data.acquiredAt === "string"
                ? new Date(data.acquiredAt)
                : data.acquiredAt ?? undefined;

        // Khởi tạo rỗng đúng kiểu rồi gán từng phần
        const createData = {} as Prisma.AcquisitionCreateInput;
        createData.vendor = { connect: { id: data.vendorId } };
        if (at) createData.acquiredAt = at;
        if (data.cost != null) createData.cost = data.cost;
        if (data.currency) createData.currency = data.currency;
        if (data.refNo !== undefined) createData.refNo = data.refNo;
        if (data.notes !== undefined) createData.notes = data.notes;
        createData.type =
            (typeof data.type === "string"
                ? (data.type as AcquisitionType)
                : data.type) ?? AcquisitionType.PURCHASE;

        return tx.acquisition.create({ data: createData, select: { id: true } });
    },
});
