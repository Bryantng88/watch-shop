import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductCreateWithoutProductVariantInputObjectSchema as ProductCreateWithoutProductVariantInputObjectSchema } from './ProductCreateWithoutProductVariantInput.schema';
import { ProductUncheckedCreateWithoutProductVariantInputObjectSchema as ProductUncheckedCreateWithoutProductVariantInputObjectSchema } from './ProductUncheckedCreateWithoutProductVariantInput.schema';
import { ProductCreateOrConnectWithoutProductVariantInputObjectSchema as ProductCreateOrConnectWithoutProductVariantInputObjectSchema } from './ProductCreateOrConnectWithoutProductVariantInput.schema';
import { ProductUpsertWithoutProductVariantInputObjectSchema as ProductUpsertWithoutProductVariantInputObjectSchema } from './ProductUpsertWithoutProductVariantInput.schema';
import { ProductWhereUniqueInputObjectSchema as ProductWhereUniqueInputObjectSchema } from './ProductWhereUniqueInput.schema';
import { ProductUpdateToOneWithWhereWithoutProductVariantInputObjectSchema as ProductUpdateToOneWithWhereWithoutProductVariantInputObjectSchema } from './ProductUpdateToOneWithWhereWithoutProductVariantInput.schema';
import { ProductUpdateWithoutProductVariantInputObjectSchema as ProductUpdateWithoutProductVariantInputObjectSchema } from './ProductUpdateWithoutProductVariantInput.schema';
import { ProductUncheckedUpdateWithoutProductVariantInputObjectSchema as ProductUncheckedUpdateWithoutProductVariantInputObjectSchema } from './ProductUncheckedUpdateWithoutProductVariantInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ProductCreateWithoutProductVariantInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutProductVariantInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ProductCreateOrConnectWithoutProductVariantInputObjectSchema).optional(),
  upsert: z.lazy(() => ProductUpsertWithoutProductVariantInputObjectSchema).optional(),
  connect: z.lazy(() => ProductWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => ProductUpdateToOneWithWhereWithoutProductVariantInputObjectSchema), z.lazy(() => ProductUpdateWithoutProductVariantInputObjectSchema), z.lazy(() => ProductUncheckedUpdateWithoutProductVariantInputObjectSchema)]).optional()
}).strict();
export const ProductUpdateOneRequiredWithoutProductVariantNestedInputObjectSchema: z.ZodType<Prisma.ProductUpdateOneRequiredWithoutProductVariantNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUpdateOneRequiredWithoutProductVariantNestedInput>;
export const ProductUpdateOneRequiredWithoutProductVariantNestedInputObjectZodSchema = makeSchema();
