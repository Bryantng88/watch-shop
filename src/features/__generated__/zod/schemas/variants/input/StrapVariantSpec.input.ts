import * as z from 'zod';

import { StrapSchema } from '../../enums/Strap.schema';
import { StrapOriginTypeSchema } from '../../enums/StrapOriginType.schema';
import { StrapSurfaceSchema } from '../../enums/StrapSurface.schema';
import { StrapInventoryPolicySchema } from '../../enums/StrapInventoryPolicy.schema';
import { StrapClaspTypeSchema } from '../../enums/StrapClaspType.schema';
import { StrapLengthClassSchema } from '../../enums/StrapLengthClass.schema';
// prettier-ignore
export const StrapVariantSpecInputSchema = z.object({
    variantId: z.string(),
    color: z.string().optional().nullable(),
    material: StrapSchema,
    quickRelease: z.boolean().optional().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    lugWidthMM: z.number().int(),
    buckleWidthMM: z.number().int().optional().nullable(),
    originType: StrapOriginTypeSchema,
    brandName: z.string().optional().nullable(),
    leatherType: z.string().optional().nullable(),
    surface: StrapSurfaceSchema.optional().nullable(),
    inventoryPolicy: StrapInventoryPolicySchema,
    claspType: StrapClaspTypeSchema.optional().nullable(),
    claspWidthMM: z.number().int().optional().nullable(),
    claspOriginType: StrapOriginTypeSchema.optional().nullable(),
    finish: z.string().optional().nullable(),
    lengthClass: StrapLengthClassSchema.optional().nullable(),
    minStockQty: z.number().int(),
    targetStockQty: z.number().int(),
    braceletReference: z.string().optional().nullable(),
    defaultFullLinks: z.number().int().optional().nullable(),
    defaultHalfLinks: z.number().int().optional().nullable(),
    defaultEndLinks: z.number().int().optional().nullable(),
    ProductVariant: z.unknown()
}).strict();

export type StrapVariantSpecInputType = z.infer<typeof StrapVariantSpecInputSchema>;
