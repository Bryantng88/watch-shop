import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductUpdateWithoutPurchaseRequestItemInputObjectSchema as ProductUpdateWithoutPurchaseRequestItemInputObjectSchema } from './ProductUpdateWithoutPurchaseRequestItemInput.schema';
import { ProductUncheckedUpdateWithoutPurchaseRequestItemInputObjectSchema as ProductUncheckedUpdateWithoutPurchaseRequestItemInputObjectSchema } from './ProductUncheckedUpdateWithoutPurchaseRequestItemInput.schema';
import { ProductCreateWithoutPurchaseRequestItemInputObjectSchema as ProductCreateWithoutPurchaseRequestItemInputObjectSchema } from './ProductCreateWithoutPurchaseRequestItemInput.schema';
import { ProductUncheckedCreateWithoutPurchaseRequestItemInputObjectSchema as ProductUncheckedCreateWithoutPurchaseRequestItemInputObjectSchema } from './ProductUncheckedCreateWithoutPurchaseRequestItemInput.schema';
import { ProductWhereInputObjectSchema as ProductWhereInputObjectSchema } from './ProductWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => ProductUpdateWithoutPurchaseRequestItemInputObjectSchema), z.lazy(() => ProductUncheckedUpdateWithoutPurchaseRequestItemInputObjectSchema)]),
  create: z.union([z.lazy(() => ProductCreateWithoutPurchaseRequestItemInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutPurchaseRequestItemInputObjectSchema)]),
  where: z.lazy(() => ProductWhereInputObjectSchema).optional()
}).strict();
export const ProductUpsertWithoutPurchaseRequestItemInputObjectSchema: z.ZodType<Prisma.ProductUpsertWithoutPurchaseRequestItemInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUpsertWithoutPurchaseRequestItemInput>;
export const ProductUpsertWithoutPurchaseRequestItemInputObjectZodSchema = makeSchema();
