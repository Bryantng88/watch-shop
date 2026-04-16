import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductContentUpdateWithoutProductInputObjectSchema as ProductContentUpdateWithoutProductInputObjectSchema } from './ProductContentUpdateWithoutProductInput.schema';
import { ProductContentUncheckedUpdateWithoutProductInputObjectSchema as ProductContentUncheckedUpdateWithoutProductInputObjectSchema } from './ProductContentUncheckedUpdateWithoutProductInput.schema';
import { ProductContentCreateWithoutProductInputObjectSchema as ProductContentCreateWithoutProductInputObjectSchema } from './ProductContentCreateWithoutProductInput.schema';
import { ProductContentUncheckedCreateWithoutProductInputObjectSchema as ProductContentUncheckedCreateWithoutProductInputObjectSchema } from './ProductContentUncheckedCreateWithoutProductInput.schema';
import { ProductContentWhereInputObjectSchema as ProductContentWhereInputObjectSchema } from './ProductContentWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => ProductContentUpdateWithoutProductInputObjectSchema), z.lazy(() => ProductContentUncheckedUpdateWithoutProductInputObjectSchema)]),
  create: z.union([z.lazy(() => ProductContentCreateWithoutProductInputObjectSchema), z.lazy(() => ProductContentUncheckedCreateWithoutProductInputObjectSchema)]),
  where: z.lazy(() => ProductContentWhereInputObjectSchema).optional()
}).strict();
export const ProductContentUpsertWithoutProductInputObjectSchema: z.ZodType<Prisma.ProductContentUpsertWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductContentUpsertWithoutProductInput>;
export const ProductContentUpsertWithoutProductInputObjectZodSchema = makeSchema();
