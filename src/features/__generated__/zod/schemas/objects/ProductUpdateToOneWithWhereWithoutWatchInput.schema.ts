import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductWhereInputObjectSchema as ProductWhereInputObjectSchema } from './ProductWhereInput.schema';
import { ProductUpdateWithoutWatchInputObjectSchema as ProductUpdateWithoutWatchInputObjectSchema } from './ProductUpdateWithoutWatchInput.schema';
import { ProductUncheckedUpdateWithoutWatchInputObjectSchema as ProductUncheckedUpdateWithoutWatchInputObjectSchema } from './ProductUncheckedUpdateWithoutWatchInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => ProductUpdateWithoutWatchInputObjectSchema), z.lazy(() => ProductUncheckedUpdateWithoutWatchInputObjectSchema)])
}).strict();
export const ProductUpdateToOneWithWhereWithoutWatchInputObjectSchema: z.ZodType<Prisma.ProductUpdateToOneWithWhereWithoutWatchInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUpdateToOneWithWhereWithoutWatchInput>;
export const ProductUpdateToOneWithWhereWithoutWatchInputObjectZodSchema = makeSchema();
