import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductUpdateWithoutWatchInputObjectSchema as ProductUpdateWithoutWatchInputObjectSchema } from './ProductUpdateWithoutWatchInput.schema';
import { ProductUncheckedUpdateWithoutWatchInputObjectSchema as ProductUncheckedUpdateWithoutWatchInputObjectSchema } from './ProductUncheckedUpdateWithoutWatchInput.schema';
import { ProductCreateWithoutWatchInputObjectSchema as ProductCreateWithoutWatchInputObjectSchema } from './ProductCreateWithoutWatchInput.schema';
import { ProductUncheckedCreateWithoutWatchInputObjectSchema as ProductUncheckedCreateWithoutWatchInputObjectSchema } from './ProductUncheckedCreateWithoutWatchInput.schema';
import { ProductWhereInputObjectSchema as ProductWhereInputObjectSchema } from './ProductWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => ProductUpdateWithoutWatchInputObjectSchema), z.lazy(() => ProductUncheckedUpdateWithoutWatchInputObjectSchema)]),
  create: z.union([z.lazy(() => ProductCreateWithoutWatchInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutWatchInputObjectSchema)]),
  where: z.lazy(() => ProductWhereInputObjectSchema).optional()
}).strict();
export const ProductUpsertWithoutWatchInputObjectSchema: z.ZodType<Prisma.ProductUpsertWithoutWatchInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUpsertWithoutWatchInput>;
export const ProductUpsertWithoutWatchInputObjectZodSchema = makeSchema();
