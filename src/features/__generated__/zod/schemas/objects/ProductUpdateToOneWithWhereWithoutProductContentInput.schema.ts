import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductWhereInputObjectSchema as ProductWhereInputObjectSchema } from './ProductWhereInput.schema';
import { ProductUpdateWithoutProductContentInputObjectSchema as ProductUpdateWithoutProductContentInputObjectSchema } from './ProductUpdateWithoutProductContentInput.schema';
import { ProductUncheckedUpdateWithoutProductContentInputObjectSchema as ProductUncheckedUpdateWithoutProductContentInputObjectSchema } from './ProductUncheckedUpdateWithoutProductContentInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => ProductUpdateWithoutProductContentInputObjectSchema), z.lazy(() => ProductUncheckedUpdateWithoutProductContentInputObjectSchema)])
}).strict();
export const ProductUpdateToOneWithWhereWithoutProductContentInputObjectSchema: z.ZodType<Prisma.ProductUpdateToOneWithWhereWithoutProductContentInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUpdateToOneWithWhereWithoutProductContentInput>;
export const ProductUpdateToOneWithWhereWithoutProductContentInputObjectZodSchema = makeSchema();
