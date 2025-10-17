import * as z from 'zod';

import { LengthLabelSchema } from '../../enums/LengthLabel.schema';
import { StrapSchema } from '../../enums/Strap.schema';
// prettier-ignore
export const StrapVariantSpecModelSchema = z.object({
    variantId: z.string(),
    widthMM: z.number().int(),
    lengthLabel: LengthLabelSchema.nullable(),
    color: z.string().nullable(),
    material: StrapSchema,
    quickRelease: z.boolean().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    variant: z.unknown()
}).strict();

export type StrapVariantSpecPureType = z.infer<typeof StrapVariantSpecModelSchema>;
