import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  productId: z.string().optional()
}).strict();
export const ProductContentWhereUniqueInputObjectSchema: z.ZodType<Prisma.ProductContentWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductContentWhereUniqueInput>;
export const ProductContentWhereUniqueInputObjectZodSchema = makeSchema();
