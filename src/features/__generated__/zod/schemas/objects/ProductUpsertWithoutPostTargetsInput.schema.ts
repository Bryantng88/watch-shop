import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductUpdateWithoutPostTargetsInputObjectSchema as ProductUpdateWithoutPostTargetsInputObjectSchema } from './ProductUpdateWithoutPostTargetsInput.schema';
import { ProductUncheckedUpdateWithoutPostTargetsInputObjectSchema as ProductUncheckedUpdateWithoutPostTargetsInputObjectSchema } from './ProductUncheckedUpdateWithoutPostTargetsInput.schema';
import { ProductCreateWithoutPostTargetsInputObjectSchema as ProductCreateWithoutPostTargetsInputObjectSchema } from './ProductCreateWithoutPostTargetsInput.schema';
import { ProductUncheckedCreateWithoutPostTargetsInputObjectSchema as ProductUncheckedCreateWithoutPostTargetsInputObjectSchema } from './ProductUncheckedCreateWithoutPostTargetsInput.schema';
import { ProductWhereInputObjectSchema as ProductWhereInputObjectSchema } from './ProductWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => ProductUpdateWithoutPostTargetsInputObjectSchema), z.lazy(() => ProductUncheckedUpdateWithoutPostTargetsInputObjectSchema)]),
  create: z.union([z.lazy(() => ProductCreateWithoutPostTargetsInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutPostTargetsInputObjectSchema)]),
  where: z.lazy(() => ProductWhereInputObjectSchema).optional()
}).strict();
export const ProductUpsertWithoutPostTargetsInputObjectSchema: z.ZodType<Prisma.ProductUpsertWithoutPostTargetsInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUpsertWithoutPostTargetsInput>;
export const ProductUpsertWithoutPostTargetsInputObjectZodSchema = makeSchema();
