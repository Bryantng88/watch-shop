import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductUpdateWithoutProductImageInputObjectSchema as ProductUpdateWithoutProductImageInputObjectSchema } from './ProductUpdateWithoutProductImageInput.schema';
import { ProductUncheckedUpdateWithoutProductImageInputObjectSchema as ProductUncheckedUpdateWithoutProductImageInputObjectSchema } from './ProductUncheckedUpdateWithoutProductImageInput.schema';
import { ProductCreateWithoutProductImageInputObjectSchema as ProductCreateWithoutProductImageInputObjectSchema } from './ProductCreateWithoutProductImageInput.schema';
import { ProductUncheckedCreateWithoutProductImageInputObjectSchema as ProductUncheckedCreateWithoutProductImageInputObjectSchema } from './ProductUncheckedCreateWithoutProductImageInput.schema';
import { ProductWhereInputObjectSchema as ProductWhereInputObjectSchema } from './ProductWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => ProductUpdateWithoutProductImageInputObjectSchema), z.lazy(() => ProductUncheckedUpdateWithoutProductImageInputObjectSchema)]),
  create: z.union([z.lazy(() => ProductCreateWithoutProductImageInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutProductImageInputObjectSchema)]),
  where: z.lazy(() => ProductWhereInputObjectSchema).optional()
}).strict();
export const ProductUpsertWithoutProductImageInputObjectSchema: z.ZodType<Prisma.ProductUpsertWithoutProductImageInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUpsertWithoutProductImageInput>;
export const ProductUpsertWithoutProductImageInputObjectZodSchema = makeSchema();
