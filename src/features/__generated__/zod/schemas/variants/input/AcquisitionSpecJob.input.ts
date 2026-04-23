import * as z from 'zod';

// prettier-ignore
export const AcquisitionSpecJobInputSchema = z.object({
    id: z.string(),
    acquisitionItemId: z.string(),
    productId: z.string(),
    status: z.string(),
    attempts: z.number().int(),
    lastError: z.string().optional().nullable(),
    startedAt: z.date().optional().nullable(),
    finishedAt: z.date().optional().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    runAfter: z.date().optional().nullable(),
    priority: z.number().int(),
    acquisitionItem: z.unknown(),
    product: z.unknown(),
    logs: z.array(z.unknown())
}).strict();

export type AcquisitionSpecJobInputType = z.infer<typeof AcquisitionSpecJobInputSchema>;
