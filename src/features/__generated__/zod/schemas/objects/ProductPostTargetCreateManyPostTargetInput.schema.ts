import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  productId: z.string(),
  createdAt: z.coerce.date().optional()
}).strict();
export const ProductPostTargetCreateManyPostTargetInputObjectSchema: z.ZodType<Prisma.ProductPostTargetCreateManyPostTargetInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductPostTargetCreateManyPostTargetInput>;
export const ProductPostTargetCreateManyPostTargetInputObjectZodSchema = makeSchema();
