import * as z from 'zod';

// prettier-ignore
export const AcquisitionSpecJobModelSchema = z.object({
    id: z.string(),
    acquisitionItemId: z.string(),
    productId: z.string(),
    status: z.string(),
    attempts: z.number().int(),
    lastError: z.string().nullable(),
    startedAt: z.date().nullable(),
    finishedAt: z.date().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    runAfter: z.date().nullable(),
    priority: z.number().int(),
    acquisitionItem: z.unknown(),
    product: z.unknown(),
    logs: z.array(z.unknown())
}).strict();

export type AcquisitionSpecJobPureType = z.infer<typeof AcquisitionSpecJobModelSchema>;
