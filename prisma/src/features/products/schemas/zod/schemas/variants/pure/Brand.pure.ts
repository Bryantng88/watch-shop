import * as z from 'zod';

import { BrandStatusSchema } from '../../enums/BrandStatus.schema';
// prettier-ignore
export const BrandModelSchema = z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
    country: z.string().nullable(),
    foundedYear: z.number().int().nullable(),
    website: z.string().nullable(),
    logoUrl: z.string().nullable(),
    isAuthorized: z.boolean(),
    status: BrandStatusSchema,
    description: z.string().nullable(),
    sortOrder: z.number().int(),
    createdAt: z.date(),
    updatedAt: z.date(),
    products: z.array(z.unknown())
}).strict();

export type BrandPureType = z.infer<typeof BrandModelSchema>;
