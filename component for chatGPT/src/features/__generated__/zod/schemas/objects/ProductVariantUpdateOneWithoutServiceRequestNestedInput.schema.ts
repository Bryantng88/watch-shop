import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductVariantCreateWithoutServiceRequestInputObjectSchema as ProductVariantCreateWithoutServiceRequestInputObjectSchema } from './ProductVariantCreateWithoutServiceRequestInput.schema';
import { ProductVariantUncheckedCreateWithoutServiceRequestInputObjectSchema as ProductVariantUncheckedCreateWithoutServiceRequestInputObjectSchema } from './ProductVariantUncheckedCreateWithoutServiceRequestInput.schema';
import { ProductVariantCreateOrConnectWithoutServiceRequestInputObjectSchema as ProductVariantCreateOrConnectWithoutServiceRequestInputObjectSchema } from './ProductVariantCreateOrConnectWithoutServiceRequestInput.schema';
import { ProductVariantUpsertWithoutServiceRequestInputObjectSchema as ProductVariantUpsertWithoutServiceRequestInputObjectSchema } from './ProductVariantUpsertWithoutServiceRequestInput.schema';
import { ProductVariantWhereInputObjectSchema as ProductVariantWhereInputObjectSchema } from './ProductVariantWhereInput.schema';
import { ProductVariantWhereUniqueInputObjectSchema as ProductVariantWhereUniqueInputObjectSchema } from './ProductVariantWhereUniqueInput.schema';
import { ProductVariantUpdateToOneWithWhereWithoutServiceRequestInputObjectSchema as ProductVariantUpdateToOneWithWhereWithoutServiceRequestInputObjectSchema } from './ProductVariantUpdateToOneWithWhereWithoutServiceRequestInput.schema';
import { ProductVariantUpdateWithoutServiceRequestInputObjectSchema as ProductVariantUpdateWithoutServiceRequestInputObjectSchema } from './ProductVariantUpdateWithoutServiceRequestInput.schema';
import { ProductVariantUncheckedUpdateWithoutServiceRequestInputObjectSchema as ProductVariantUncheckedUpdateWithoutServiceRequestInputObjectSchema } from './ProductVariantUncheckedUpdateWithoutServiceRequestInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ProductVariantCreateWithoutServiceRequestInputObjectSchema), z.lazy(() => ProductVariantUncheckedCreateWithoutServiceRequestInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ProductVariantCreateOrConnectWithoutServiceRequestInputObjectSchema).optional(),
  upsert: z.lazy(() => ProductVariantUpsertWithoutServiceRequestInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => ProductVariantWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => ProductVariantWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => ProductVariantWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => ProductVariantUpdateToOneWithWhereWithoutServiceRequestInputObjectSchema), z.lazy(() => ProductVariantUpdateWithoutServiceRequestInputObjectSchema), z.lazy(() => ProductVariantUncheckedUpdateWithoutServiceRequestInputObjectSchema)]).optional()
}).strict();
export const ProductVariantUpdateOneWithoutServiceRequestNestedInputObjectSchema: z.ZodType<Prisma.ProductVariantUpdateOneWithoutServiceRequestNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductVariantUpdateOneWithoutServiceRequestNestedInput>;
export const ProductVariantUpdateOneWithoutServiceRequestNestedInputObjectZodSchema = makeSchema();
