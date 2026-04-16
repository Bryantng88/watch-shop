import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductWhereInputObjectSchema as ProductWhereInputObjectSchema } from './ProductWhereInput.schema';
import { ProductUpdateWithoutProductImageInputObjectSchema as ProductUpdateWithoutProductImageInputObjectSchema } from './ProductUpdateWithoutProductImageInput.schema';
import { ProductUncheckedUpdateWithoutProductImageInputObjectSchema as ProductUncheckedUpdateWithoutProductImageInputObjectSchema } from './ProductUncheckedUpdateWithoutProductImageInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => ProductUpdateWithoutProductImageInputObjectSchema), z.lazy(() => ProductUncheckedUpdateWithoutProductImageInputObjectSchema)])
}).strict();
export const ProductUpdateToOneWithWhereWithoutProductImageInputObjectSchema: z.ZodType<Prisma.ProductUpdateToOneWithWhereWithoutProductImageInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUpdateToOneWithWhereWithoutProductImageInput>;
export const ProductUpdateToOneWithWhereWithoutProductImageInputObjectZodSchema = makeSchema();
