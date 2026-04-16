import * as z from 'zod';

export const ProductSaleStageSchema = z.enum(['NOT_READY', 'READY_TO_POST', 'LIVE', 'HOLD', 'SOLD'])

export type ProductSaleStage = z.infer<typeof ProductSaleStageSchema>;