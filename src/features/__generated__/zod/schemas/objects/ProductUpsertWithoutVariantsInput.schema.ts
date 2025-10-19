import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductUpdateWithoutVariantsInputObjectSchema as ProductUpdateWithoutVariantsInputObjectSchema } from './ProductUpdateWithoutVariantsInput.schema';
import { ProductUncheckedUpdateWithoutVariantsInputObjectSchema as ProductUncheckedUpdateWithoutVariantsInputObjectSchema } from './ProductUncheckedUpdateWithoutVariantsInput.schema';
import { ProductCreateWithoutVariantsInputObjectSchema as ProductCreateWithoutVariantsInputObjectSchema } from './ProductCreateWithoutVariantsInput.schema';
import { ProductUncheckedCreateWithoutVariantsInputObjectSchema as ProductUncheckedCreateWithoutVariantsInputObjectSchema } from './ProductUncheckedCreateWithoutVariantsInput.schema';
import { ProductWhereInputObjectSchema as ProductWhereInputObjectSchema } from './ProductWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => ProductUpdateWithoutVariantsInputObjectSchema), z.lazy(() => ProductUncheckedUpdateWithoutVariantsInputObjectSchema)]),
  create: z.union([z.lazy(() => ProductCreateWithoutVariantsInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutVariantsInputObjectSchema)]),
  where: z.lazy(() => ProductWhereInputObjectSchema).optional()
}).strict();
export const ProductUpsertWithoutVariantsInputObjectSchema: z.ZodType<Prisma.ProductUpsertWithoutVariantsInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUpsertWithoutVariantsInput>;
export const ProductUpsertWithoutVariantsInputObjectZodSchema = makeSchema();
