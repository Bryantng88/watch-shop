import * as z from 'zod';

import { PartTypeSchema } from '../../enums/PartType.schema';
// prettier-ignore
export const PartVariantSpecModelSchema = z.object({
    variantId: z.string(),
    partType: PartTypeSchema,
    variant: z.unknown()
}).strict();

export type PartVariantSpecPureType = z.infer<typeof PartVariantSpecModelSchema>;
