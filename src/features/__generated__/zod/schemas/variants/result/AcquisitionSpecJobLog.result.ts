import * as z from 'zod';

// prettier-ignore
export const AcquisitionSpecJobLogResultSchema = z.object({
    id: z.string(),
    acquisitionSpecJobId: z.string(),
    acquisitionItemId: z.string(),
    acquisitionId: z.string().nullable(),
    productId: z.string().nullable(),
    stage: z.string(),
    level: z.string(),
    message: z.string(),
    payload: z.unknown().nullable(),
    createdAt: z.date(),
    acquisitionSpecJob: z.unknown()
}).strict();

export type AcquisitionSpecJobLogResultType = z.infer<typeof AcquisitionSpecJobLogResultSchema>;
