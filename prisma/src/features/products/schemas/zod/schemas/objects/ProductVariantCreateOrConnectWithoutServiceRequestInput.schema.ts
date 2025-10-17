import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductVariantWhereUniqueInputObjectSchema as ProductVariantWhereUniqueInputObjectSchema } from './ProductVariantWhereUniqueInput.schema';
import { ProductVariantCreateWithoutServiceRequestInputObjectSchema as ProductVariantCreateWithoutServiceRequestInputObjectSchema } from './ProductVariantCreateWithoutServiceRequestInput.schema';
import { ProductVariantUncheckedCreateWithoutServiceRequestInputObjectSchema as ProductVariantUncheckedCreateWithoutServiceRequestInputObjectSchema } from './ProductVariantUncheckedCreateWithoutServiceRequestInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductVariantWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ProductVariantCreateWithoutServiceRequestInputObjectSchema), z.lazy(() => ProductVariantUncheckedCreateWithoutServiceRequestInputObjectSchema)])
}).strict();
export const ProductVariantCreateOrConnectWithoutServiceRequestInputObjectSchema: z.ZodType<Prisma.ProductVariantCreateOrConnectWithoutServiceRequestInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductVariantCreateOrConnectWithoutServiceRequestInput>;
export const ProductVariantCreateOrConnectWithoutServiceRequestInputObjectZodSchema = makeSchema();
