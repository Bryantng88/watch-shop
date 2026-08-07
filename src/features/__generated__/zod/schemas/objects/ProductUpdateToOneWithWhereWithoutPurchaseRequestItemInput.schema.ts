import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductWhereInputObjectSchema as ProductWhereInputObjectSchema } from './ProductWhereInput.schema';
import { ProductUpdateWithoutPurchaseRequestItemInputObjectSchema as ProductUpdateWithoutPurchaseRequestItemInputObjectSchema } from './ProductUpdateWithoutPurchaseRequestItemInput.schema';
import { ProductUncheckedUpdateWithoutPurchaseRequestItemInputObjectSchema as ProductUncheckedUpdateWithoutPurchaseRequestItemInputObjectSchema } from './ProductUncheckedUpdateWithoutPurchaseRequestItemInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => ProductUpdateWithoutPurchaseRequestItemInputObjectSchema), z.lazy(() => ProductUncheckedUpdateWithoutPurchaseRequestItemInputObjectSchema)])
}).strict();
export const ProductUpdateToOneWithWhereWithoutPurchaseRequestItemInputObjectSchema: z.ZodType<Prisma.ProductUpdateToOneWithWhereWithoutPurchaseRequestItemInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUpdateToOneWithWhereWithoutPurchaseRequestItemInput>;
export const ProductUpdateToOneWithWhereWithoutPurchaseRequestItemInputObjectZodSchema = makeSchema();
