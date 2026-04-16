import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductImageWhereUniqueInputObjectSchema as ProductImageWhereUniqueInputObjectSchema } from './ProductImageWhereUniqueInput.schema';
import { ProductImageUpdateWithoutProductInputObjectSchema as ProductImageUpdateWithoutProductInputObjectSchema } from './ProductImageUpdateWithoutProductInput.schema';
import { ProductImageUncheckedUpdateWithoutProductInputObjectSchema as ProductImageUncheckedUpdateWithoutProductInputObjectSchema } from './ProductImageUncheckedUpdateWithoutProductInput.schema';
import { ProductImageCreateWithoutProductInputObjectSchema as ProductImageCreateWithoutProductInputObjectSchema } from './ProductImageCreateWithoutProductInput.schema';
import { ProductImageUncheckedCreateWithoutProductInputObjectSchema as ProductImageUncheckedCreateWithoutProductInputObjectSchema } from './ProductImageUncheckedCreateWithoutProductInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductImageWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => ProductImageUpdateWithoutProductInputObjectSchema), z.lazy(() => ProductImageUncheckedUpdateWithoutProductInputObjectSchema)]),
  create: z.union([z.lazy(() => ProductImageCreateWithoutProductInputObjectSchema), z.lazy(() => ProductImageUncheckedCreateWithoutProductInputObjectSchema)])
}).strict();
export const ProductImageUpsertWithWhereUniqueWithoutProductInputObjectSchema: z.ZodType<Prisma.ProductImageUpsertWithWhereUniqueWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductImageUpsertWithWhereUniqueWithoutProductInput>;
export const ProductImageUpsertWithWhereUniqueWithoutProductInputObjectZodSchema = makeSchema();
