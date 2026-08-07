import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductCreateWithoutPurchaseRequestItemInputObjectSchema as ProductCreateWithoutPurchaseRequestItemInputObjectSchema } from './ProductCreateWithoutPurchaseRequestItemInput.schema';
import { ProductUncheckedCreateWithoutPurchaseRequestItemInputObjectSchema as ProductUncheckedCreateWithoutPurchaseRequestItemInputObjectSchema } from './ProductUncheckedCreateWithoutPurchaseRequestItemInput.schema';
import { ProductCreateOrConnectWithoutPurchaseRequestItemInputObjectSchema as ProductCreateOrConnectWithoutPurchaseRequestItemInputObjectSchema } from './ProductCreateOrConnectWithoutPurchaseRequestItemInput.schema';
import { ProductUpsertWithoutPurchaseRequestItemInputObjectSchema as ProductUpsertWithoutPurchaseRequestItemInputObjectSchema } from './ProductUpsertWithoutPurchaseRequestItemInput.schema';
import { ProductWhereUniqueInputObjectSchema as ProductWhereUniqueInputObjectSchema } from './ProductWhereUniqueInput.schema';
import { ProductUpdateToOneWithWhereWithoutPurchaseRequestItemInputObjectSchema as ProductUpdateToOneWithWhereWithoutPurchaseRequestItemInputObjectSchema } from './ProductUpdateToOneWithWhereWithoutPurchaseRequestItemInput.schema';
import { ProductUpdateWithoutPurchaseRequestItemInputObjectSchema as ProductUpdateWithoutPurchaseRequestItemInputObjectSchema } from './ProductUpdateWithoutPurchaseRequestItemInput.schema';
import { ProductUncheckedUpdateWithoutPurchaseRequestItemInputObjectSchema as ProductUncheckedUpdateWithoutPurchaseRequestItemInputObjectSchema } from './ProductUncheckedUpdateWithoutPurchaseRequestItemInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ProductCreateWithoutPurchaseRequestItemInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutPurchaseRequestItemInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ProductCreateOrConnectWithoutPurchaseRequestItemInputObjectSchema).optional(),
  upsert: z.lazy(() => ProductUpsertWithoutPurchaseRequestItemInputObjectSchema).optional(),
  connect: z.lazy(() => ProductWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => ProductUpdateToOneWithWhereWithoutPurchaseRequestItemInputObjectSchema), z.lazy(() => ProductUpdateWithoutPurchaseRequestItemInputObjectSchema), z.lazy(() => ProductUncheckedUpdateWithoutPurchaseRequestItemInputObjectSchema)]).optional()
}).strict();
export const ProductUpdateOneRequiredWithoutPurchaseRequestItemNestedInputObjectSchema: z.ZodType<Prisma.ProductUpdateOneRequiredWithoutPurchaseRequestItemNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUpdateOneRequiredWithoutPurchaseRequestItemNestedInput>;
export const ProductUpdateOneRequiredWithoutPurchaseRequestItemNestedInputObjectZodSchema = makeSchema();
