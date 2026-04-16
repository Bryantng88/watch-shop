import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductVariantCreateWithoutServiceRequestInputObjectSchema as ProductVariantCreateWithoutServiceRequestInputObjectSchema } from './ProductVariantCreateWithoutServiceRequestInput.schema';
import { ProductVariantUncheckedCreateWithoutServiceRequestInputObjectSchema as ProductVariantUncheckedCreateWithoutServiceRequestInputObjectSchema } from './ProductVariantUncheckedCreateWithoutServiceRequestInput.schema';
import { ProductVariantCreateOrConnectWithoutServiceRequestInputObjectSchema as ProductVariantCreateOrConnectWithoutServiceRequestInputObjectSchema } from './ProductVariantCreateOrConnectWithoutServiceRequestInput.schema';
import { ProductVariantWhereUniqueInputObjectSchema as ProductVariantWhereUniqueInputObjectSchema } from './ProductVariantWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ProductVariantCreateWithoutServiceRequestInputObjectSchema), z.lazy(() => ProductVariantUncheckedCreateWithoutServiceRequestInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ProductVariantCreateOrConnectWithoutServiceRequestInputObjectSchema).optional(),
  connect: z.lazy(() => ProductVariantWhereUniqueInputObjectSchema).optional()
}).strict();
export const ProductVariantCreateNestedOneWithoutServiceRequestInputObjectSchema: z.ZodType<Prisma.ProductVariantCreateNestedOneWithoutServiceRequestInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductVariantCreateNestedOneWithoutServiceRequestInput>;
export const ProductVariantCreateNestedOneWithoutServiceRequestInputObjectZodSchema = makeSchema();
