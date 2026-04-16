import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductUpdateWithoutOrderItemInputObjectSchema as ProductUpdateWithoutOrderItemInputObjectSchema } from './ProductUpdateWithoutOrderItemInput.schema';
import { ProductUncheckedUpdateWithoutOrderItemInputObjectSchema as ProductUncheckedUpdateWithoutOrderItemInputObjectSchema } from './ProductUncheckedUpdateWithoutOrderItemInput.schema';
import { ProductCreateWithoutOrderItemInputObjectSchema as ProductCreateWithoutOrderItemInputObjectSchema } from './ProductCreateWithoutOrderItemInput.schema';
import { ProductUncheckedCreateWithoutOrderItemInputObjectSchema as ProductUncheckedCreateWithoutOrderItemInputObjectSchema } from './ProductUncheckedCreateWithoutOrderItemInput.schema';
import { ProductWhereInputObjectSchema as ProductWhereInputObjectSchema } from './ProductWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => ProductUpdateWithoutOrderItemInputObjectSchema), z.lazy(() => ProductUncheckedUpdateWithoutOrderItemInputObjectSchema)]),
  create: z.union([z.lazy(() => ProductCreateWithoutOrderItemInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutOrderItemInputObjectSchema)]),
  where: z.lazy(() => ProductWhereInputObjectSchema).optional()
}).strict();
export const ProductUpsertWithoutOrderItemInputObjectSchema: z.ZodType<Prisma.ProductUpsertWithoutOrderItemInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUpsertWithoutOrderItemInput>;
export const ProductUpsertWithoutOrderItemInputObjectZodSchema = makeSchema();
