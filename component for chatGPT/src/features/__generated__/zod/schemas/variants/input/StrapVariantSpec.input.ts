import * as z from 'zod';

import { StrapSchema } from '../../enums/Strap.schema';
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
    variant: z.unknown()
}).strict();

export type StrapVariantSpecInputType = z.infer<typeof StrapVariantSpecInputSchema>;
