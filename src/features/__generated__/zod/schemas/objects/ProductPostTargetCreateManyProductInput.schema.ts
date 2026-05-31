import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  postTargetId: z.string(),
  createdAt: z.coerce.date().optional()
}).strict();
export const ProductPostTargetCreateManyProductInputObjectSchema: z.ZodType<Prisma.ProductPostTargetCreateManyProductInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductPostTargetCreateManyProductInput>;
export const ProductPostTargetCreateManyProductInputObjectZodSchema = makeSchema();
