import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderCreateWithoutPurchaseRequestInputObjectSchema as OrderCreateWithoutPurchaseRequestInputObjectSchema } from './OrderCreateWithoutPurchaseRequestInput.schema';
import { OrderUncheckedCreateWithoutPurchaseRequestInputObjectSchema as OrderUncheckedCreateWithoutPurchaseRequestInputObjectSchema } from './OrderUncheckedCreateWithoutPurchaseRequestInput.schema';
import { OrderCreateOrConnectWithoutPurchaseRequestInputObjectSchema as OrderCreateOrConnectWithoutPurchaseRequestInputObjectSchema } from './OrderCreateOrConnectWithoutPurchaseRequestInput.schema';
import { OrderWhereUniqueInputObjectSchema as OrderWhereUniqueInputObjectSchema } from './OrderWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => OrderCreateWithoutPurchaseRequestInputObjectSchema), z.lazy(() => OrderUncheckedCreateWithoutPurchaseRequestInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => OrderCreateOrConnectWithoutPurchaseRequestInputObjectSchema).optional(),
  connect: z.lazy(() => OrderWhereUniqueInputObjectSchema).optional()
}).strict();
export const OrderCreateNestedOneWithoutPurchaseRequestInputObjectSchema: z.ZodType<Prisma.OrderCreateNestedOneWithoutPurchaseRequestInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderCreateNestedOneWithoutPurchaseRequestInput>;
export const OrderCreateNestedOneWithoutPurchaseRequestInputObjectZodSchema = makeSchema();
