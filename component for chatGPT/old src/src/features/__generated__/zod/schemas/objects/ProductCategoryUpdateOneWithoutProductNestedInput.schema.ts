import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductCategoryCreateWithoutProductInputObjectSchema as ProductCategoryCreateWithoutProductInputObjectSchema } from './ProductCategoryCreateWithoutProductInput.schema';
import { ProductCategoryUncheckedCreateWithoutProductInputObjectSchema as ProductCategoryUncheckedCreateWithoutProductInputObjectSchema } from './ProductCategoryUncheckedCreateWithoutProductInput.schema';
import { ProductCategoryCreateOrConnectWithoutProductInputObjectSchema as ProductCategoryCreateOrConnectWithoutProductInputObjectSchema } from './ProductCategoryCreateOrConnectWithoutProductInput.schema';
import { ProductCategoryUpsertWithoutProductInputObjectSchema as ProductCategoryUpsertWithoutProductInputObjectSchema } from './ProductCategoryUpsertWithoutProductInput.schema';
import { ProductCategoryWhereInputObjectSchema as ProductCategoryWhereInputObjectSchema } from './ProductCategoryWhereInput.schema';
import { ProductCategoryWhereUniqueInputObjectSchema as ProductCategoryWhereUniqueInputObjectSchema } from './ProductCategoryWhereUniqueInput.schema';
import { ProductCategoryUpdateToOneWithWhereWithoutProductInputObjectSchema as ProductCategoryUpdateToOneWithWhereWithoutProductInputObjectSchema } from './ProductCategoryUpdateToOneWithWhereWithoutProductInput.schema';
import { ProductCategoryUpdateWithoutProductInputObjectSchema as ProductCategoryUpdateWithoutProductInputObjectSchema } from './ProductCategoryUpdateWithoutProductInput.schema';
import { ProductCategoryUncheckedUpdateWithoutProductInputObjectSchema as ProductCategoryUncheckedUpdateWithoutProductInputObjectSchema } from './ProductCategoryUncheckedUpdateWithoutProductInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ProductCategoryCreateWithoutProductInputObjectSchema), z.lazy(() => ProductCategoryUncheckedCreateWithoutProductInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ProductCategoryCreateOrConnectWithoutProductInputObjectSchema).optional(),
  upsert: z.lazy(() => ProductCategoryUpsertWithoutProductInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => ProductCategoryWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => ProductCategoryWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => ProductCategoryWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => ProductCategoryUpdateToOneWithWhereWithoutProductInputObjectSchema), z.lazy(() => ProductCategoryUpdateWithoutProductInputObjectSchema), z.lazy(() => ProductCategoryUncheckedUpdateWithoutProductInputObjectSchema)]).optional()
}).strict();
export const ProductCategoryUpdateOneWithoutProductNestedInputObjectSchema: z.ZodType<Prisma.ProductCategoryUpdateOneWithoutProductNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductCategoryUpdateOneWithoutProductNestedInput>;
export const ProductCategoryUpdateOneWithoutProductNestedInputObjectZodSchema = makeSchema();
