import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductPostTargetProductIdPostTargetIdCompoundUniqueInputObjectSchema as ProductPostTargetProductIdPostTargetIdCompoundUniqueInputObjectSchema } from './ProductPostTargetProductIdPostTargetIdCompoundUniqueInput.schema'

const makeSchema = () => z.object({
  productId_postTargetId: z.lazy(() => ProductPostTargetProductIdPostTargetIdCompoundUniqueInputObjectSchema).optional()
}).strict();
export const ProductPostTargetWhereUniqueInputObjectSchema: z.ZodType<Prisma.ProductPostTargetWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductPostTargetWhereUniqueInput>;
export const ProductPostTargetWhereUniqueInputObjectZodSchema = makeSchema();
