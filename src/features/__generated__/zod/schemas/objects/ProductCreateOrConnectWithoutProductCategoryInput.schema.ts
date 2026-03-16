import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductWhereUniqueInputObjectSchema as ProductWhereUniqueInputObjectSchema } from './ProductWhereUniqueInput.schema';
import { ProductCreateWithoutProductCategoryInputObjectSchema as ProductCreateWithoutProductCategoryInputObjectSchema } from './ProductCreateWithoutProductCategoryInput.schema';
import { ProductUncheckedCreateWithoutProductCategoryInputObjectSchema as ProductUncheckedCreateWithoutProductCategoryInputObjectSchema } from './ProductUncheckedCreateWithoutProductCategoryInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ProductCreateWithoutProductCategoryInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutProductCategoryInputObjectSchema)])
}).strict();
export const ProductCreateOrConnectWithoutProductCategoryInputObjectSchema: z.ZodType<Prisma.ProductCreateOrConnectWithoutProductCategoryInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductCreateOrConnectWithoutProductCategoryInput>;
export const ProductCreateOrConnectWithoutProductCategoryInputObjectZodSchema = makeSchema();
