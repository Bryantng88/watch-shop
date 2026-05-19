import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderItemWhereUniqueInputObjectSchema as OrderItemWhereUniqueInputObjectSchema } from './OrderItemWhereUniqueInput.schema';
import { OrderItemCreateWithoutChildOrderItemsInputObjectSchema as OrderItemCreateWithoutChildOrderItemsInputObjectSchema } from './OrderItemCreateWithoutChildOrderItemsInput.schema';
import { OrderItemUncheckedCreateWithoutChildOrderItemsInputObjectSchema as OrderItemUncheckedCreateWithoutChildOrderItemsInputObjectSchema } from './OrderItemUncheckedCreateWithoutChildOrderItemsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => OrderItemWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => OrderItemCreateWithoutChildOrderItemsInputObjectSchema), z.lazy(() => OrderItemUncheckedCreateWithoutChildOrderItemsInputObjectSchema)])
}).strict();
export const OrderItemCreateOrConnectWithoutChildOrderItemsInputObjectSchema: z.ZodType<Prisma.OrderItemCreateOrConnectWithoutChildOrderItemsInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderItemCreateOrConnectWithoutChildOrderItemsInput>;
export const OrderItemCreateOrConnectWithoutChildOrderItemsInputObjectZodSchema = makeSchema();
