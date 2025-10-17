import * as z from 'zod';

import { PartTypeSchema } from '../../enums/PartType.schema';
// prettier-ignore
export const PartVariantSpecResultSchema = z.object({
    variantId: z.string(),
    partType: PartTypeSchema,
    variant: z.unknown()
}).strict();

export type PartVariantSpecResultType = z.infer<typeof PartVariantSpecResultSchema>;
