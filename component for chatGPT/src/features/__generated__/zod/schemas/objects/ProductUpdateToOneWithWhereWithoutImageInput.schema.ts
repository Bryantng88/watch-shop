import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductWhereInputObjectSchema as ProductWhereInputObjectSchema } from './ProductWhereInput.schema';
import { ProductUpdateWithoutImageInputObjectSchema as ProductUpdateWithoutImageInputObjectSchema } from './ProductUpdateWithoutImageInput.schema';
import { ProductUncheckedUpdateWithoutImageInputObjectSchema as ProductUncheckedUpdateWithoutImageInputObjectSchema } from './ProductUncheckedUpdateWithoutImageInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => ProductUpdateWithoutImageInputObjectSchema), z.lazy(() => ProductUncheckedUpdateWithoutImageInputObjectSchema)])
}).strict();
export const ProductUpdateToOneWithWhereWithoutImageInputObjectSchema: z.ZodType<Prisma.ProductUpdateToOneWithWhereWithoutImageInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUpdateToOneWithWhereWithoutImageInput>;
export const ProductUpdateToOneWithWhereWithoutImageInputObjectZodSchema = makeSchema();
