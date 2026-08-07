import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderUpdateWithoutPurchaseRequestInputObjectSchema as OrderUpdateWithoutPurchaseRequestInputObjectSchema } from './OrderUpdateWithoutPurchaseRequestInput.schema';
import { OrderUncheckedUpdateWithoutPurchaseRequestInputObjectSchema as OrderUncheckedUpdateWithoutPurchaseRequestInputObjectSchema } from './OrderUncheckedUpdateWithoutPurchaseRequestInput.schema';
import { OrderCreateWithoutPurchaseRequestInputObjectSchema as OrderCreateWithoutPurchaseRequestInputObjectSchema } from './OrderCreateWithoutPurchaseRequestInput.schema';
import { OrderUncheckedCreateWithoutPurchaseRequestInputObjectSchema as OrderUncheckedCreateWithoutPurchaseRequestInputObjectSchema } from './OrderUncheckedCreateWithoutPurchaseRequestInput.schema';
import { OrderWhereInputObjectSchema as OrderWhereInputObjectSchema } from './OrderWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => OrderUpdateWithoutPurchaseRequestInputObjectSchema), z.lazy(() => OrderUncheckedUpdateWithoutPurchaseRequestInputObjectSchema)]),
  create: z.union([z.lazy(() => OrderCreateWithoutPurchaseRequestInputObjectSchema), z.lazy(() => OrderUncheckedCreateWithoutPurchaseRequestInputObjectSchema)]),
  where: z.lazy(() => OrderWhereInputObjectSchema).optional()
}).strict();
export const OrderUpsertWithoutPurchaseRequestInputObjectSchema: z.ZodType<Prisma.OrderUpsertWithoutPurchaseRequestInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderUpsertWithoutPurchaseRequestInput>;
export const OrderUpsertWithoutPurchaseRequestInputObjectZodSchema = makeSchema();
