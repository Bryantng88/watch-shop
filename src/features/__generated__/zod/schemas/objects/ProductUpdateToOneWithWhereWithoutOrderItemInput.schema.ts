import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductWhereInputObjectSchema as ProductWhereInputObjectSchema } from './ProductWhereInput.schema';
import { ProductUpdateWithoutOrderItemInputObjectSchema as ProductUpdateWithoutOrderItemInputObjectSchema } from './ProductUpdateWithoutOrderItemInput.schema';
import { ProductUncheckedUpdateWithoutOrderItemInputObjectSchema as ProductUncheckedUpdateWithoutOrderItemInputObjectSchema } from './ProductUncheckedUpdateWithoutOrderItemInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => ProductUpdateWithoutOrderItemInputObjectSchema), z.lazy(() => ProductUncheckedUpdateWithoutOrderItemInputObjectSchema)])
}).strict();
export const ProductUpdateToOneWithWhereWithoutOrderItemInputObjectSchema: z.ZodType<Prisma.ProductUpdateToOneWithWhereWithoutOrderItemInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUpdateToOneWithWhereWithoutOrderItemInput>;
export const ProductUpdateToOneWithWhereWithoutOrderItemInputObjectZodSchema = makeSchema();
