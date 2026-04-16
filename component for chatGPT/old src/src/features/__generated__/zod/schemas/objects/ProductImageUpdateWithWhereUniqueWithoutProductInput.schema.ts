import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductImageWhereUniqueInputObjectSchema as ProductImageWhereUniqueInputObjectSchema } from './ProductImageWhereUniqueInput.schema';
import { ProductImageUpdateWithoutProductInputObjectSchema as ProductImageUpdateWithoutProductInputObjectSchema } from './ProductImageUpdateWithoutProductInput.schema';
import { ProductImageUncheckedUpdateWithoutProductInputObjectSchema as ProductImageUncheckedUpdateWithoutProductInputObjectSchema } from './ProductImageUncheckedUpdateWithoutProductInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductImageWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => ProductImageUpdateWithoutProductInputObjectSchema), z.lazy(() => ProductImageUncheckedUpdateWithoutProductInputObjectSchema)])
}).strict();
export const ProductImageUpdateWithWhereUniqueWithoutProductInputObjectSchema: z.ZodType<Prisma.ProductImageUpdateWithWhereUniqueWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductImageUpdateWithWhereUniqueWithoutProductInput>;
export const ProductImageUpdateWithWhereUniqueWithoutProductInputObjectZodSchema = makeSchema();
