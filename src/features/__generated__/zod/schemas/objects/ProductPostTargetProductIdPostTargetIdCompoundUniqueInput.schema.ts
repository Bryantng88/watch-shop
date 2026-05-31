import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  productId: z.string(),
  postTargetId: z.string()
}).strict();
export const ProductPostTargetProductIdPostTargetIdCompoundUniqueInputObjectSchema: z.ZodType<Prisma.ProductPostTargetProductIdPostTargetIdCompoundUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductPostTargetProductIdPostTargetIdCompoundUniqueInput>;
export const ProductPostTargetProductIdPostTargetIdCompoundUniqueInputObjectZodSchema = makeSchema();
