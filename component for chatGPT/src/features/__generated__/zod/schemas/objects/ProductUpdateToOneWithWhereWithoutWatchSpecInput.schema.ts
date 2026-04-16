import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductWhereInputObjectSchema as ProductWhereInputObjectSchema } from './ProductWhereInput.schema';
import { ProductUpdateWithoutWatchSpecInputObjectSchema as ProductUpdateWithoutWatchSpecInputObjectSchema } from './ProductUpdateWithoutWatchSpecInput.schema';
import { ProductUncheckedUpdateWithoutWatchSpecInputObjectSchema as ProductUncheckedUpdateWithoutWatchSpecInputObjectSchema } from './ProductUncheckedUpdateWithoutWatchSpecInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => ProductUpdateWithoutWatchSpecInputObjectSchema), z.lazy(() => ProductUncheckedUpdateWithoutWatchSpecInputObjectSchema)])
}).strict();
export const ProductUpdateToOneWithWhereWithoutWatchSpecInputObjectSchema: z.ZodType<Prisma.ProductUpdateToOneWithWhereWithoutWatchSpecInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUpdateToOneWithWhereWithoutWatchSpecInput>;
export const ProductUpdateToOneWithWhereWithoutWatchSpecInputObjectZodSchema = makeSchema();
