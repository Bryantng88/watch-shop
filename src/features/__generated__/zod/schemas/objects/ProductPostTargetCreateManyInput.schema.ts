import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  productId: z.string(),
  postTargetId: z.string(),
  createdAt: z.coerce.date().optional()
}).strict();
export const ProductPostTargetCreateManyInputObjectSchema: z.ZodType<Prisma.ProductPostTargetCreateManyInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductPostTargetCreateManyInput>;
export const ProductPostTargetCreateManyInputObjectZodSchema = makeSchema();
