import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductWhereUniqueInputObjectSchema as ProductWhereUniqueInputObjectSchema } from './ProductWhereUniqueInput.schema';
import { ProductCreateWithoutPurchaseRequestItemInputObjectSchema as ProductCreateWithoutPurchaseRequestItemInputObjectSchema } from './ProductCreateWithoutPurchaseRequestItemInput.schema';
import { ProductUncheckedCreateWithoutPurchaseRequestItemInputObjectSchema as ProductUncheckedCreateWithoutPurchaseRequestItemInputObjectSchema } from './ProductUncheckedCreateWithoutPurchaseRequestItemInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ProductCreateWithoutPurchaseRequestItemInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutPurchaseRequestItemInputObjectSchema)])
}).strict();
export const ProductCreateOrConnectWithoutPurchaseRequestItemInputObjectSchema: z.ZodType<Prisma.ProductCreateOrConnectWithoutPurchaseRequestItemInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductCreateOrConnectWithoutPurchaseRequestItemInput>;
export const ProductCreateOrConnectWithoutPurchaseRequestItemInputObjectZodSchema = makeSchema();
