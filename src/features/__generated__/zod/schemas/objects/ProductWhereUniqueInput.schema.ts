import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional(),
  slug: z.string().optional()
}).strict();
export const ProductWhereUniqueInputObjectSchema: z.ZodType<Prisma.ProductWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductWhereUniqueInput>;
export const ProductWhereUniqueInputObjectZodSchema = makeSchema();
