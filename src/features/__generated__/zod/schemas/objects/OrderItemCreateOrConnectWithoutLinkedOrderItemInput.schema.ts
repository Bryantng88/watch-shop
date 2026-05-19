import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderItemWhereUniqueInputObjectSchema as OrderItemWhereUniqueInputObjectSchema } from './OrderItemWhereUniqueInput.schema';
import { OrderItemCreateWithoutLinkedOrderItemInputObjectSchema as OrderItemCreateWithoutLinkedOrderItemInputObjectSchema } from './OrderItemCreateWithoutLinkedOrderItemInput.schema';
import { OrderItemUncheckedCreateWithoutLinkedOrderItemInputObjectSchema as OrderItemUncheckedCreateWithoutLinkedOrderItemInputObjectSchema } from './OrderItemUncheckedCreateWithoutLinkedOrderItemInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => OrderItemWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => OrderItemCreateWithoutLinkedOrderItemInputObjectSchema), z.lazy(() => OrderItemUncheckedCreateWithoutLinkedOrderItemInputObjectSchema)])
}).strict();
export const OrderItemCreateOrConnectWithoutLinkedOrderItemInputObjectSchema: z.ZodType<Prisma.OrderItemCreateOrConnectWithoutLinkedOrderItemInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderItemCreateOrConnectWithoutLinkedOrderItemInput>;
export const OrderItemCreateOrConnectWithoutLinkedOrderItemInputObjectZodSchema = makeSchema();
