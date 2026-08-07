import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductCreateWithoutPurchaseRequestItemInputObjectSchema as ProductCreateWithoutPurchaseRequestItemInputObjectSchema } from './ProductCreateWithoutPurchaseRequestItemInput.schema';
import { ProductUncheckedCreateWithoutPurchaseRequestItemInputObjectSchema as ProductUncheckedCreateWithoutPurchaseRequestItemInputObjectSchema } from './ProductUncheckedCreateWithoutPurchaseRequestItemInput.schema';
import { ProductCreateOrConnectWithoutPurchaseRequestItemInputObjectSchema as ProductCreateOrConnectWithoutPurchaseRequestItemInputObjectSchema } from './ProductCreateOrConnectWithoutPurchaseRequestItemInput.schema';
import { ProductWhereUniqueInputObjectSchema as ProductWhereUniqueInputObjectSchema } from './ProductWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ProductCreateWithoutPurchaseRequestItemInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutPurchaseRequestItemInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ProductCreateOrConnectWithoutPurchaseRequestItemInputObjectSchema).optional(),
  connect: z.lazy(() => ProductWhereUniqueInputObjectSchema).optional()
}).strict();
export const ProductCreateNestedOneWithoutPurchaseRequestItemInputObjectSchema: z.ZodType<Prisma.ProductCreateNestedOneWithoutPurchaseRequestItemInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductCreateNestedOneWithoutPurchaseRequestItemInput>;
export const ProductCreateNestedOneWithoutPurchaseRequestItemInputObjectZodSchema = makeSchema();
