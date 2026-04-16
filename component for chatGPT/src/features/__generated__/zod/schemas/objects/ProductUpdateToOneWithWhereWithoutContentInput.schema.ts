import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductWhereInputObjectSchema as ProductWhereInputObjectSchema } from './ProductWhereInput.schema';
import { ProductUpdateWithoutContentInputObjectSchema as ProductUpdateWithoutContentInputObjectSchema } from './ProductUpdateWithoutContentInput.schema';
import { ProductUncheckedUpdateWithoutContentInputObjectSchema as ProductUncheckedUpdateWithoutContentInputObjectSchema } from './ProductUncheckedUpdateWithoutContentInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => ProductUpdateWithoutContentInputObjectSchema), z.lazy(() => ProductUncheckedUpdateWithoutContentInputObjectSchema)])
}).strict();
export const ProductUpdateToOneWithWhereWithoutContentInputObjectSchema: z.ZodType<Prisma.ProductUpdateToOneWithWhereWithoutContentInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUpdateToOneWithWhereWithoutContentInput>;
export const ProductUpdateToOneWithWhereWithoutContentInputObjectZodSchema = makeSchema();
