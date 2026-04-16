import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductUpdateWithoutProductContentInputObjectSchema as ProductUpdateWithoutProductContentInputObjectSchema } from './ProductUpdateWithoutProductContentInput.schema';
import { ProductUncheckedUpdateWithoutProductContentInputObjectSchema as ProductUncheckedUpdateWithoutProductContentInputObjectSchema } from './ProductUncheckedUpdateWithoutProductContentInput.schema';
import { ProductCreateWithoutProductContentInputObjectSchema as ProductCreateWithoutProductContentInputObjectSchema } from './ProductCreateWithoutProductContentInput.schema';
import { ProductUncheckedCreateWithoutProductContentInputObjectSchema as ProductUncheckedCreateWithoutProductContentInputObjectSchema } from './ProductUncheckedCreateWithoutProductContentInput.schema';
import { ProductWhereInputObjectSchema as ProductWhereInputObjectSchema } from './ProductWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => ProductUpdateWithoutProductContentInputObjectSchema), z.lazy(() => ProductUncheckedUpdateWithoutProductContentInputObjectSchema)]),
  create: z.union([z.lazy(() => ProductCreateWithoutProductContentInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutProductContentInputObjectSchema)]),
  where: z.lazy(() => ProductWhereInputObjectSchema).optional()
}).strict();
export const ProductUpsertWithoutProductContentInputObjectSchema: z.ZodType<Prisma.ProductUpsertWithoutProductContentInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUpsertWithoutProductContentInput>;
export const ProductUpsertWithoutProductContentInputObjectZodSchema = makeSchema();
