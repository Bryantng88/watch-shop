import { Prisma, PrismaClient, AcquisitionType } from "@prisma/client";
import prisma from '@/server/db/client';
type Tx = Parameters<Parameters<typeof prisma.$transaction>[0]>[0];
type Db = typeof prisma | Tx;

const toAcqType = (s?: string): AcquisitionType => {
    const key = (s ?? 'PURCHASE').toUpperCase() as keyof typeof AcquisitionType;
    return AcquisitionType[key] ?? AcquisitionType.PURCHASE;
};
// tách type input để tránh "Excessive stack depth"
export type CreateAcqInput = {
    vendorId: string;
    acquiredAt?: Date;
    cost?: number;
    currency?: string;
    refNo?: string | null;
    notes?: string | null;
    type?: AcquisitionType | string; // chấp nhận string từ form
};

export const acquisitionRepo = (db: Db) => ({
    async create(data: CreateAcqInput) {
        // ép về đúng kiểu 'data' mà Prisma cần
        const createData: Prisma.AcquisitionCreateArgs['data'] = {
            vendor: { connect: { id: data.vendorId } },
            acquiredAt: data.acquiredAt ?? new Date(),
            cost: data.cost ?? 0,
            currency: data.currency ?? 'VND',
            refNo: data.refNo ?? null,
            notes: data.notes ?? null,
            type:
                (typeof data.type === 'string' ? toAcqType(data.type) : data.type) ??
                AcquisitionType.PURCHASE,
        };

        return db.acquisition.create({
            data: createData,
            select: { id: true },
        });
    },
});