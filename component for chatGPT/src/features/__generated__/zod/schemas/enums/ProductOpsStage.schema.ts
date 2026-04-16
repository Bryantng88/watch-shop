import * as z from 'zod';

export const ProductOpsStageSchema = z.enum(['NORMAL', 'IN_SERVICE', 'BLOCKED', 'SOLD'])

export type ProductOpsStage = z.infer<typeof ProductOpsStageSchema>;