import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductWhereInputObjectSchema as ProductWhereInputObjectSchema } from './ProductWhereInput.schema';
import { ProductUpdateWithoutVariantsInputObjectSchema as ProductUpdateWithoutVariantsInputObjectSchema } from './ProductUpdateWithoutVariantsInput.schema';
import { ProductUncheckedUpdateWithoutVariantsInputObjectSchema as ProductUncheckedUpdateWithoutVariantsInputObjectSchema } from './ProductUncheckedUpdateWithoutVariantsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => ProductUpdateWithoutVariantsInputObjectSchema), z.lazy(() => ProductUncheckedUpdateWithoutVariantsInputObjectSchema)])
}).strict();
export const ProductUpdateToOneWithWhereWithoutVariantsInputObjectSchema: z.ZodType<Prisma.ProductUpdateToOneWithWhereWithoutVariantsInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUpdateToOneWithWhereWithoutVariantsInput>;
export const ProductUpdateToOneWithWhereWithoutVariantsInputObjectZodSchema = makeSchema();
