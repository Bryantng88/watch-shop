import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductContentWhereInputObjectSchema as ProductContentWhereInputObjectSchema } from './ProductContentWhereInput.schema';
import { ProductContentUpdateWithoutProductInputObjectSchema as ProductContentUpdateWithoutProductInputObjectSchema } from './ProductContentUpdateWithoutProductInput.schema';
import { ProductContentUncheckedUpdateWithoutProductInputObjectSchema as ProductContentUncheckedUpdateWithoutProductInputObjectSchema } from './ProductContentUncheckedUpdateWithoutProductInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductContentWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => ProductContentUpdateWithoutProductInputObjectSchema), z.lazy(() => ProductContentUncheckedUpdateWithoutProductInputObjectSchema)])
}).strict();
export const ProductContentUpdateToOneWithWhereWithoutProductInputObjectSchema: z.ZodType<Prisma.ProductContentUpdateToOneWithWhereWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductContentUpdateToOneWithWhereWithoutProductInput>;
export const ProductContentUpdateToOneWithWhereWithoutProductInputObjectZodSchema = makeSchema();
