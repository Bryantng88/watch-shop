import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductUpdateWithoutContentInputObjectSchema as ProductUpdateWithoutContentInputObjectSchema } from './ProductUpdateWithoutContentInput.schema';
import { ProductUncheckedUpdateWithoutContentInputObjectSchema as ProductUncheckedUpdateWithoutContentInputObjectSchema } from './ProductUncheckedUpdateWithoutContentInput.schema';
import { ProductCreateWithoutContentInputObjectSchema as ProductCreateWithoutContentInputObjectSchema } from './ProductCreateWithoutContentInput.schema';
import { ProductUncheckedCreateWithoutContentInputObjectSchema as ProductUncheckedCreateWithoutContentInputObjectSchema } from './ProductUncheckedCreateWithoutContentInput.schema';
import { ProductWhereInputObjectSchema as ProductWhereInputObjectSchema } from './ProductWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => ProductUpdateWithoutContentInputObjectSchema), z.lazy(() => ProductUncheckedUpdateWithoutContentInputObjectSchema)]),
  create: z.union([z.lazy(() => ProductCreateWithoutContentInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutContentInputObjectSchema)]),
  where: z.lazy(() => ProductWhereInputObjectSchema).optional()
}).strict();
export const ProductUpsertWithoutContentInputObjectSchema: z.ZodType<Prisma.ProductUpsertWithoutContentInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUpsertWithoutContentInput>;
export const ProductUpsertWithoutContentInputObjectZodSchema = makeSchema();
