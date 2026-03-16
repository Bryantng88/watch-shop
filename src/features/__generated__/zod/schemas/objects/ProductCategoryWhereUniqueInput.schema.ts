import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional(),
  code: z.string().optional()
}).strict();
export const ProductCategoryWhereUniqueInputObjectSchema: z.ZodType<Prisma.ProductCategoryWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductCategoryWhereUniqueInput>;
export const ProductCategoryWhereUniqueInputObjectZodSchema = makeSchema();
