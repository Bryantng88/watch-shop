import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductVariantUpdateWithoutAcquisitionItemInputObjectSchema as ProductVariantUpdateWithoutAcquisitionItemInputObjectSchema } from './ProductVariantUpdateWithoutAcquisitionItemInput.schema';
import { ProductVariantUncheckedUpdateWithoutAcquisitionItemInputObjectSchema as ProductVariantUncheckedUpdateWithoutAcquisitionItemInputObjectSchema } from './ProductVariantUncheckedUpdateWithoutAcquisitionItemInput.schema';
import { ProductVariantCreateWithoutAcquisitionItemInputObjectSchema as ProductVariantCreateWithoutAcquisitionItemInputObjectSchema } from './ProductVariantCreateWithoutAcquisitionItemInput.schema';
import { ProductVariantUncheckedCreateWithoutAcquisitionItemInputObjectSchema as ProductVariantUncheckedCreateWithoutAcquisitionItemInputObjectSchema } from './ProductVariantUncheckedCreateWithoutAcquisitionItemInput.schema';
import { ProductVariantWhereInputObjectSchema as ProductVariantWhereInputObjectSchema } from './ProductVariantWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => ProductVariantUpdateWithoutAcquisitionItemInputObjectSchema), z.lazy(() => ProductVariantUncheckedUpdateWithoutAcquisitionItemInputObjectSchema)]),
  create: z.union([z.lazy(() => ProductVariantCreateWithoutAcquisitionItemInputObjectSchema), z.lazy(() => ProductVariantUncheckedCreateWithoutAcquisitionItemInputObjectSchema)]),
  where: z.lazy(() => ProductVariantWhereInputObjectSchema).optional()
}).strict();
export const ProductVariantUpsertWithoutAcquisitionItemInputObjectSchema: z.ZodType<Prisma.ProductVariantUpsertWithoutAcquisitionItemInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductVariantUpsertWithoutAcquisitionItemInput>;
export const ProductVariantUpsertWithoutAcquisitionItemInputObjectZodSchema = makeSchema();
