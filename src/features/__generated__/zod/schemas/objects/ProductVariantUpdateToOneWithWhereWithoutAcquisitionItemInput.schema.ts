import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductVariantWhereInputObjectSchema as ProductVariantWhereInputObjectSchema } from './ProductVariantWhereInput.schema';
import { ProductVariantUpdateWithoutAcquisitionItemInputObjectSchema as ProductVariantUpdateWithoutAcquisitionItemInputObjectSchema } from './ProductVariantUpdateWithoutAcquisitionItemInput.schema';
import { ProductVariantUncheckedUpdateWithoutAcquisitionItemInputObjectSchema as ProductVariantUncheckedUpdateWithoutAcquisitionItemInputObjectSchema } from './ProductVariantUncheckedUpdateWithoutAcquisitionItemInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductVariantWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => ProductVariantUpdateWithoutAcquisitionItemInputObjectSchema), z.lazy(() => ProductVariantUncheckedUpdateWithoutAcquisitionItemInputObjectSchema)])
}).strict();
export const ProductVariantUpdateToOneWithWhereWithoutAcquisitionItemInputObjectSchema: z.ZodType<Prisma.ProductVariantUpdateToOneWithWhereWithoutAcquisitionItemInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductVariantUpdateToOneWithWhereWithoutAcquisitionItemInput>;
export const ProductVariantUpdateToOneWithWhereWithoutAcquisitionItemInputObjectZodSchema = makeSchema();
