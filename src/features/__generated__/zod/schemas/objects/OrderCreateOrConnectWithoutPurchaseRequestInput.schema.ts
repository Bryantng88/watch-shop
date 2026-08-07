import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderWhereUniqueInputObjectSchema as OrderWhereUniqueInputObjectSchema } from './OrderWhereUniqueInput.schema';
import { OrderCreateWithoutPurchaseRequestInputObjectSchema as OrderCreateWithoutPurchaseRequestInputObjectSchema } from './OrderCreateWithoutPurchaseRequestInput.schema';
import { OrderUncheckedCreateWithoutPurchaseRequestInputObjectSchema as OrderUncheckedCreateWithoutPurchaseRequestInputObjectSchema } from './OrderUncheckedCreateWithoutPurchaseRequestInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => OrderWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => OrderCreateWithoutPurchaseRequestInputObjectSchema), z.lazy(() => OrderUncheckedCreateWithoutPurchaseRequestInputObjectSchema)])
}).strict();
export const OrderCreateOrConnectWithoutPurchaseRequestInputObjectSchema: z.ZodType<Prisma.OrderCreateOrConnectWithoutPurchaseRequestInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderCreateOrConnectWithoutPurchaseRequestInput>;
export const OrderCreateOrConnectWithoutPurchaseRequestInputObjectZodSchema = makeSchema();
