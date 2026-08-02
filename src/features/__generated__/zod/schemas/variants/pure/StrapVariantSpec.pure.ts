import * as z from 'zod';

import { StrapSchema } from '../../enums/Strap.schema';
import { StrapOriginTypeSchema } from '../../enums/StrapOriginType.schema';
import { StrapSurfaceSchema } from '../../enums/StrapSurface.schema';
import { StrapInventoryPolicySchema } from '../../enums/StrapInventoryPolicy.schema';
import { StrapClaspTypeSchema } from '../../enums/StrapClaspType.schema';
import { StrapLengthClassSchema } from '../../enums/StrapLengthClass.schema';
// prettier-ignore
export const StrapVariantSpecModelSchema = z.object({
    variantId: z.string(),
    color: z.string().nullable(),
    material: StrapSchema,
    quickRelease: z.boolean().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    lugWidthMM: z.number().int(),
    buckleWidthMM: z.number().int().nullable(),
    originType: StrapOriginTypeSchema,
    brandName: z.string().nullable(),
    leatherType: z.string().nullable(),
    surface: StrapSurfaceSchema.nullable(),
    inventoryPolicy: StrapInventoryPolicySchema,
    claspType: StrapClaspTypeSchema.nullable(),
    claspWidthMM: z.number().int().nullable(),
    claspOriginType: StrapOriginTypeSchema.nullable(),
    finish: z.string().nullable(),
    lengthClass: StrapLengthClassSchema.nullable(),
    minStockQty: z.number().int(),
    targetStockQty: z.number().int(),
    braceletReference: z.string().nullable(),
    defaultFullLinks: z.number().int().nullable(),
    defaultHalfLinks: z.number().int().nullable(),
    defaultEndLinks: z.number().int().nullable(),
    ProductVariant: z.unknown()
}).strict();

export type StrapVariantSpecPureType = z.infer<typeof StrapVariantSpecModelSchema>;
