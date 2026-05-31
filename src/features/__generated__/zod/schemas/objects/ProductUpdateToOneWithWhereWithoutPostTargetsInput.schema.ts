import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductWhereInputObjectSchema as ProductWhereInputObjectSchema } from './ProductWhereInput.schema';
import { ProductUpdateWithoutPostTargetsInputObjectSchema as ProductUpdateWithoutPostTargetsInputObjectSchema } from './ProductUpdateWithoutPostTargetsInput.schema';
import { ProductUncheckedUpdateWithoutPostTargetsInputObjectSchema as ProductUncheckedUpdateWithoutPostTargetsInputObjectSchema } from './ProductUncheckedUpdateWithoutPostTargetsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => ProductUpdateWithoutPostTargetsInputObjectSchema), z.lazy(() => ProductUncheckedUpdateWithoutPostTargetsInputObjectSchema)])
}).strict();
export const ProductUpdateToOneWithWhereWithoutPostTargetsInputObjectSchema: z.ZodType<Prisma.ProductUpdateToOneWithWhereWithoutPostTargetsInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUpdateToOneWithWhereWithoutPostTargetsInput>;
export const ProductUpdateToOneWithWhereWithoutPostTargetsInputObjectZodSchema = makeSchema();
