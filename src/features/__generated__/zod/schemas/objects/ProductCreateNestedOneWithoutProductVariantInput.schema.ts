import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductCreateWithoutProductVariantInputObjectSchema as ProductCreateWithoutProductVariantInputObjectSchema } from './ProductCreateWithoutProductVariantInput.schema';
import { ProductUncheckedCreateWithoutProductVariantInputObjectSchema as ProductUncheckedCreateWithoutProductVariantInputObjectSchema } from './ProductUncheckedCreateWithoutProductVariantInput.schema';
import { ProductCreateOrConnectWithoutProductVariantInputObjectSchema as ProductCreateOrConnectWithoutProductVariantInputObjectSchema } from './ProductCreateOrConnectWithoutProductVariantInput.schema';
import { ProductWhereUniqueInputObjectSchema as ProductWhereUniqueInputObjectSchema } from './ProductWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ProductCreateWithoutProductVariantInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutProductVariantInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ProductCreateOrConnectWithoutProductVariantInputObjectSchema).optional(),
  connect: z.lazy(() => ProductWhereUniqueInputObjectSchema).optional()
}).strict();
export const ProductCreateNestedOneWithoutProductVariantInputObjectSchema: z.ZodType<Prisma.ProductCreateNestedOneWithoutProductVariantInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductCreateNestedOneWithoutProductVariantInput>;
export const ProductCreateNestedOneWithoutProductVariantInputObjectZodSchema = makeSchema();
