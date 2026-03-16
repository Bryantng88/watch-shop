import * as z from 'zod';

export const ProductCategoryScopeSchema = z.enum(['WATCH', 'WATCH_STRAP', 'ALL'])

export type ProductCategoryScope = z.infer<typeof ProductCategoryScopeSchema>;