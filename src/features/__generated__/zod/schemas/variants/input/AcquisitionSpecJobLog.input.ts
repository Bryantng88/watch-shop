import * as z from 'zod';

// prettier-ignore
export const AcquisitionSpecJobLogInputSchema = z.object({
    id: z.string(),
    acquisitionSpecJobId: z.string(),
    acquisitionItemId: z.string(),
    acquisitionId: z.string().optional().nullable(),
    productId: z.string().optional().nullable(),
    stage: z.string(),
    level: z.string(),
    message: z.string(),
    payload: z.unknown().optional().nullable(),
    createdAt: z.date(),
    acquisitionSpecJob: z.unknown()
}).strict();

export type AcquisitionSpecJobLogInputType = z.infer<typeof AcquisitionSpecJobLogInputSchema>;
