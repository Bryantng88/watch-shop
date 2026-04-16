import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductWhereUniqueInputObjectSchema as ProductWhereUniqueInputObjectSchema } from './ProductWhereUniqueInput.schema';
import { ProductCreateWithoutProductVariantInputObjectSchema as ProductCreateWithoutProductVariantInputObjectSchema } from './ProductCreateWithoutProductVariantInput.schema';
import { ProductUncheckedCreateWithoutProductVariantInputObjectSchema as ProductUncheckedCreateWithoutProductVariantInputObjectSchema } from './ProductUncheckedCreateWithoutProductVariantInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ProductCreateWithoutProductVariantInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutProductVariantInputObjectSchema)])
}).strict();
export const ProductCreateOrConnectWithoutProductVariantInputObjectSchema: z.ZodType<Prisma.ProductCreateOrConnectWithoutProductVariantInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductCreateOrConnectWithoutProductVariantInput>;
export const ProductCreateOrConnectWithoutProductVariantInputObjectZodSchema = makeSchema();
