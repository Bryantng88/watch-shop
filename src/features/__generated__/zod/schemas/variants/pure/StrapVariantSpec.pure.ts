import * as z from 'zod';

import { StrapSchema } from '../../enums/Strap.schema';
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
    variant: z.unknown()
}).strict();

export type StrapVariantSpecPureType = z.infer<typeof StrapVariantSpecModelSchema>;
