import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  Product: z.boolean().optional()
}).strict();
export const ProductCategoryCountOutputTypeSelectObjectSchema: z.ZodType<Prisma.ProductCategoryCountOutputTypeSelect> = makeSchema() as unknown as z.ZodType<Prisma.ProductCategoryCountOutputTypeSelect>;
export const ProductCategoryCountOutputTypeSelectObjectZodSchema = makeSchema();
