import * as z from 'zod';

import { StrapClaspTypeSchema } from '../../enums/StrapClaspType.schema';
import { StrapOriginTypeSchema } from '../../enums/StrapOriginType.schema';
// prettier-ignore
export const ClaspVariantSpecModelSchema = z.object({
    variantId: z.string(),
    claspType: StrapClaspTypeSchema,
    widthMM: z.number().int(),
    originType: StrapOriginTypeSchema,
    brandName: z.string().nullable(),
    color: z.string().nullable(),
    finish: z.string().nullable(),
    minStockQty: z.number().int(),
    targetStockQty: z.number().int(),
    createdAt: z.date(),
    updatedAt: z.date(),
    ProductVariant: z.unknown()
}).strict();

export type ClaspVariantSpecPureType = z.infer<typeof ClaspVariantSpecModelSchema>;
