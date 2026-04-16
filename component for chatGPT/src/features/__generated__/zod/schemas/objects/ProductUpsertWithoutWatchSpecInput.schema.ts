import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductUpdateWithoutWatchSpecInputObjectSchema as ProductUpdateWithoutWatchSpecInputObjectSchema } from './ProductUpdateWithoutWatchSpecInput.schema';
import { ProductUncheckedUpdateWithoutWatchSpecInputObjectSchema as ProductUncheckedUpdateWithoutWatchSpecInputObjectSchema } from './ProductUncheckedUpdateWithoutWatchSpecInput.schema';
import { ProductCreateWithoutWatchSpecInputObjectSchema as ProductCreateWithoutWatchSpecInputObjectSchema } from './ProductCreateWithoutWatchSpecInput.schema';
import { ProductUncheckedCreateWithoutWatchSpecInputObjectSchema as ProductUncheckedCreateWithoutWatchSpecInputObjectSchema } from './ProductUncheckedCreateWithoutWatchSpecInput.schema';
import { ProductWhereInputObjectSchema as ProductWhereInputObjectSchema } from './ProductWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => ProductUpdateWithoutWatchSpecInputObjectSchema), z.lazy(() => ProductUncheckedUpdateWithoutWatchSpecInputObjectSchema)]),
  create: z.union([z.lazy(() => ProductCreateWithoutWatchSpecInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutWatchSpecInputObjectSchema)]),
  where: z.lazy(() => ProductWhereInputObjectSchema).optional()
}).strict();
export const ProductUpsertWithoutWatchSpecInputObjectSchema: z.ZodType<Prisma.ProductUpsertWithoutWatchSpecInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUpsertWithoutWatchSpecInput>;
export const ProductUpsertWithoutWatchSpecInputObjectZodSchema = makeSchema();
