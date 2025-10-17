import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductUpdateWithoutImageInputObjectSchema as ProductUpdateWithoutImageInputObjectSchema } from './ProductUpdateWithoutImageInput.schema';
import { ProductUncheckedUpdateWithoutImageInputObjectSchema as ProductUncheckedUpdateWithoutImageInputObjectSchema } from './ProductUncheckedUpdateWithoutImageInput.schema';
import { ProductCreateWithoutImageInputObjectSchema as ProductCreateWithoutImageInputObjectSchema } from './ProductCreateWithoutImageInput.schema';
import { ProductUncheckedCreateWithoutImageInputObjectSchema as ProductUncheckedCreateWithoutImageInputObjectSchema } from './ProductUncheckedCreateWithoutImageInput.schema';
import { ProductWhereInputObjectSchema as ProductWhereInputObjectSchema } from './ProductWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => ProductUpdateWithoutImageInputObjectSchema), z.lazy(() => ProductUncheckedUpdateWithoutImageInputObjectSchema)]),
  create: z.union([z.lazy(() => ProductCreateWithoutImageInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutImageInputObjectSchema)]),
  where: z.lazy(() => ProductWhereInputObjectSchema).optional()
}).strict();
export const ProductUpsertWithoutImageInputObjectSchema: z.ZodType<Prisma.ProductUpsertWithoutImageInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUpsertWithoutImageInput>;
export const ProductUpsertWithoutImageInputObjectZodSchema = makeSchema();
