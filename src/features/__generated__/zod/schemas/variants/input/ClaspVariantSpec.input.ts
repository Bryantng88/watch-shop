import * as z from 'zod';

import { StrapClaspTypeSchema } from '../../enums/StrapClaspType.schema';
import { StrapOriginTypeSchema } from '../../enums/StrapOriginType.schema';
// prettier-ignore
export const ClaspVariantSpecInputSchema = z.object({
    variantId: z.string(),
    claspType: StrapClaspTypeSchema,
    widthMM: z.number().int(),
    originType: StrapOriginTypeSchema,
    brandName: z.string().optional().nullable(),
    color: z.string().optional().nullable(),
    finish: z.string().optional().nullable(),
    minStockQty: z.number().int(),
    targetStockQty: z.number().int(),
    createdAt: z.date(),
    updatedAt: z.date(),
    ProductVariant: z.unknown()
}).strict();

export type ClaspVariantSpecInputType = z.infer<typeof ClaspVariantSpecInputSchema>;
