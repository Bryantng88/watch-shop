import * as z from 'zod';

import { BrandStatusSchema } from '../../enums/BrandStatus.schema';
// prettier-ignore
export const BrandInputSchema = z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
    country: z.string().optional().nullable(),
    foundedYear: z.number().int().optional().nullable(),
    website: z.string().optional().nullable(),
    logoUrl: z.string().optional().nullable(),
    isAuthorized: z.boolean(),
    status: BrandStatusSchema,
    description: z.string().optional().nullable(),
    sortOrder: z.number().int(),
    createdAt: z.date(),
    updatedAt: z.date(),
    products: z.array(z.unknown())
}).strict();

export type BrandInputType = z.infer<typeof BrandInputSchema>;
