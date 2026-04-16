import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderItemWhereUniqueInputObjectSchema as OrderItemWhereUniqueInputObjectSchema } from './OrderItemWhereUniqueInput.schema';
import { OrderItemCreateWithoutOther_OrderItemInputObjectSchema as OrderItemCreateWithoutOther_OrderItemInputObjectSchema } from './OrderItemCreateWithoutOther_OrderItemInput.schema';
import { OrderItemUncheckedCreateWithoutOther_OrderItemInputObjectSchema as OrderItemUncheckedCreateWithoutOther_OrderItemInputObjectSchema } from './OrderItemUncheckedCreateWithoutOther_OrderItemInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => OrderItemWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => OrderItemCreateWithoutOther_OrderItemInputObjectSchema), z.lazy(() => OrderItemUncheckedCreateWithoutOther_OrderItemInputObjectSchema)])
}).strict();
export const OrderItemCreateOrConnectWithoutOther_OrderItemInputObjectSchema: z.ZodType<Prisma.OrderItemCreateOrConnectWithoutOther_OrderItemInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderItemCreateOrConnectWithoutOther_OrderItemInput>;
export const OrderItemCreateOrConnectWithoutOther_OrderItemInputObjectZodSchema = makeSchema();
