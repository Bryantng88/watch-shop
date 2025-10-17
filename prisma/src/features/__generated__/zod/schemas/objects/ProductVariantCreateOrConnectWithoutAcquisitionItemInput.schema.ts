import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductVariantWhereUniqueInputObjectSchema as ProductVariantWhereUniqueInputObjectSchema } from './ProductVariantWhereUniqueInput.schema';
import { ProductVariantCreateWithoutAcquisitionItemInputObjectSchema as ProductVariantCreateWithoutAcquisitionItemInputObjectSchema } from './ProductVariantCreateWithoutAcquisitionItemInput.schema';
import { ProductVariantUncheckedCreateWithoutAcquisitionItemInputObjectSchema as ProductVariantUncheckedCreateWithoutAcquisitionItemInputObjectSchema } from './ProductVariantUncheckedCreateWithoutAcquisitionItemInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductVariantWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ProductVariantCreateWithoutAcquisitionItemInputObjectSchema), z.lazy(() => ProductVariantUncheckedCreateWithoutAcquisitionItemInputObjectSchema)])
}).strict();
export const ProductVariantCreateOrConnectWithoutAcquisitionItemInputObjectSchema: z.ZodType<Prisma.ProductVariantCreateOrConnectWithoutAcquisitionItemInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductVariantCreateOrConnectWithoutAcquisitionItemInput>;
export const ProductVariantCreateOrConnectWithoutAcquisitionItemInputObjectZodSchema = makeSchema();
