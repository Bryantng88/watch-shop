import * as z from 'zod';

import { ProductCategoryScopeSchema } from '../../enums/ProductCategoryScope.schema';
// prettier-ignore
export const ProductCategoryInputSchema = z.object({
    id: z.string(),
    code: z.string(),
    name: z.string(),
    scope: ProductCategoryScopeSchema,
    isActive: z.boolean(),
    sortOrder: z.number().int(),
    createdAt: z.date(),
    updatedAt: z.date(),
    Product: z.array(z.unknown())
}).strict();

export type ProductCategoryInputType = z.infer<typeof ProductCategoryInputSchema>;
