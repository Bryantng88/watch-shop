import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductVariantCreateWithoutAcquisitionItemInputObjectSchema as ProductVariantCreateWithoutAcquisitionItemInputObjectSchema } from './ProductVariantCreateWithoutAcquisitionItemInput.schema';
import { ProductVariantUncheckedCreateWithoutAcquisitionItemInputObjectSchema as ProductVariantUncheckedCreateWithoutAcquisitionItemInputObjectSchema } from './ProductVariantUncheckedCreateWithoutAcquisitionItemInput.schema';
import { ProductVariantCreateOrConnectWithoutAcquisitionItemInputObjectSchema as ProductVariantCreateOrConnectWithoutAcquisitionItemInputObjectSchema } from './ProductVariantCreateOrConnectWithoutAcquisitionItemInput.schema';
import { ProductVariantWhereUniqueInputObjectSchema as ProductVariantWhereUniqueInputObjectSchema } from './ProductVariantWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ProductVariantCreateWithoutAcquisitionItemInputObjectSchema), z.lazy(() => ProductVariantUncheckedCreateWithoutAcquisitionItemInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ProductVariantCreateOrConnectWithoutAcquisitionItemInputObjectSchema).optional(),
  connect: z.lazy(() => ProductVariantWhereUniqueInputObjectSchema).optional()
}).strict();
export const ProductVariantCreateNestedOneWithoutAcquisitionItemInputObjectSchema: z.ZodType<Prisma.ProductVariantCreateNestedOneWithoutAcquisitionItemInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductVariantCreateNestedOneWithoutAcquisitionItemInput>;
export const ProductVariantCreateNestedOneWithoutAcquisitionItemInputObjectZodSchema = makeSchema();
