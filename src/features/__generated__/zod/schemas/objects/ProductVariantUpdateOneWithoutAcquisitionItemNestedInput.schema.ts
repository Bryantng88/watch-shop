import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductVariantCreateWithoutAcquisitionItemInputObjectSchema as ProductVariantCreateWithoutAcquisitionItemInputObjectSchema } from './ProductVariantCreateWithoutAcquisitionItemInput.schema';
import { ProductVariantUncheckedCreateWithoutAcquisitionItemInputObjectSchema as ProductVariantUncheckedCreateWithoutAcquisitionItemInputObjectSchema } from './ProductVariantUncheckedCreateWithoutAcquisitionItemInput.schema';
import { ProductVariantCreateOrConnectWithoutAcquisitionItemInputObjectSchema as ProductVariantCreateOrConnectWithoutAcquisitionItemInputObjectSchema } from './ProductVariantCreateOrConnectWithoutAcquisitionItemInput.schema';
import { ProductVariantUpsertWithoutAcquisitionItemInputObjectSchema as ProductVariantUpsertWithoutAcquisitionItemInputObjectSchema } from './ProductVariantUpsertWithoutAcquisitionItemInput.schema';
import { ProductVariantWhereInputObjectSchema as ProductVariantWhereInputObjectSchema } from './ProductVariantWhereInput.schema';
import { ProductVariantWhereUniqueInputObjectSchema as ProductVariantWhereUniqueInputObjectSchema } from './ProductVariantWhereUniqueInput.schema';
import { ProductVariantUpdateToOneWithWhereWithoutAcquisitionItemInputObjectSchema as ProductVariantUpdateToOneWithWhereWithoutAcquisitionItemInputObjectSchema } from './ProductVariantUpdateToOneWithWhereWithoutAcquisitionItemInput.schema';
import { ProductVariantUpdateWithoutAcquisitionItemInputObjectSchema as ProductVariantUpdateWithoutAcquisitionItemInputObjectSchema } from './ProductVariantUpdateWithoutAcquisitionItemInput.schema';
import { ProductVariantUncheckedUpdateWithoutAcquisitionItemInputObjectSchema as ProductVariantUncheckedUpdateWithoutAcquisitionItemInputObjectSchema } from './ProductVariantUncheckedUpdateWithoutAcquisitionItemInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ProductVariantCreateWithoutAcquisitionItemInputObjectSchema), z.lazy(() => ProductVariantUncheckedCreateWithoutAcquisitionItemInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ProductVariantCreateOrConnectWithoutAcquisitionItemInputObjectSchema).optional(),
  upsert: z.lazy(() => ProductVariantUpsertWithoutAcquisitionItemInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => ProductVariantWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => ProductVariantWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => ProductVariantWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => ProductVariantUpdateToOneWithWhereWithoutAcquisitionItemInputObjectSchema), z.lazy(() => ProductVariantUpdateWithoutAcquisitionItemInputObjectSchema), z.lazy(() => ProductVariantUncheckedUpdateWithoutAcquisitionItemInputObjectSchema)]).optional()
}).strict();
export const ProductVariantUpdateOneWithoutAcquisitionItemNestedInputObjectSchema: z.ZodType<Prisma.ProductVariantUpdateOneWithoutAcquisitionItemNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductVariantUpdateOneWithoutAcquisitionItemNestedInput>;
export const ProductVariantUpdateOneWithoutAcquisitionItemNestedInputObjectZodSchema = makeSchema();
