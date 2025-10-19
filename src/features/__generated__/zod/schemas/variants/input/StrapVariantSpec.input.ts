import * as z from 'zod';

import { LengthLabelSchema } from '../../enums/LengthLabel.schema';
import { StrapSchema } from '../../enums/Strap.schema';
// prettier-ignore
export const StrapVariantSpecInputSchema = z.object({
    variantId: z.string(),
    widthMM: z.number().int(),
    lengthLabel: LengthLabelSchema.optional().nullable(),
    color: z.string().optional().nullable(),
    material: StrapSchema,
    quickRelease: z.boolean().optional().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    variant: z.unknown()
}).strict();

export type StrapVariantSpecInputType = z.infer<typeof StrapVariantSpecInputSchema>;
