import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional()
}).strict();
export const ProductImageWhereUniqueInputObjectSchema: z.ZodType<Prisma.ProductImageWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductImageWhereUniqueInput>;
export const ProductImageWhereUniqueInputObjectZodSchema = makeSchema();
