import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductVariantUpdateWithoutServiceRequestInputObjectSchema as ProductVariantUpdateWithoutServiceRequestInputObjectSchema } from './ProductVariantUpdateWithoutServiceRequestInput.schema';
import { ProductVariantUncheckedUpdateWithoutServiceRequestInputObjectSchema as ProductVariantUncheckedUpdateWithoutServiceRequestInputObjectSchema } from './ProductVariantUncheckedUpdateWithoutServiceRequestInput.schema';
import { ProductVariantCreateWithoutServiceRequestInputObjectSchema as ProductVariantCreateWithoutServiceRequestInputObjectSchema } from './ProductVariantCreateWithoutServiceRequestInput.schema';
import { ProductVariantUncheckedCreateWithoutServiceRequestInputObjectSchema as ProductVariantUncheckedCreateWithoutServiceRequestInputObjectSchema } from './ProductVariantUncheckedCreateWithoutServiceRequestInput.schema';
import { ProductVariantWhereInputObjectSchema as ProductVariantWhereInputObjectSchema } from './ProductVariantWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => ProductVariantUpdateWithoutServiceRequestInputObjectSchema), z.lazy(() => ProductVariantUncheckedUpdateWithoutServiceRequestInputObjectSchema)]),
  create: z.union([z.lazy(() => ProductVariantCreateWithoutServiceRequestInputObjectSchema), z.lazy(() => ProductVariantUncheckedCreateWithoutServiceRequestInputObjectSchema)]),
  where: z.lazy(() => ProductVariantWhereInputObjectSchema).optional()
}).strict();
export const ProductVariantUpsertWithoutServiceRequestInputObjectSchema: z.ZodType<Prisma.ProductVariantUpsertWithoutServiceRequestInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductVariantUpsertWithoutServiceRequestInput>;
export const ProductVariantUpsertWithoutServiceRequestInputObjectZodSchema = makeSchema();
