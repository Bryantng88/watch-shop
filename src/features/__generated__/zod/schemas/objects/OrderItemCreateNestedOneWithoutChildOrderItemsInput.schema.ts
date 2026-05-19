import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderItemCreateWithoutChildOrderItemsInputObjectSchema as OrderItemCreateWithoutChildOrderItemsInputObjectSchema } from './OrderItemCreateWithoutChildOrderItemsInput.schema';
import { OrderItemUncheckedCreateWithoutChildOrderItemsInputObjectSchema as OrderItemUncheckedCreateWithoutChildOrderItemsInputObjectSchema } from './OrderItemUncheckedCreateWithoutChildOrderItemsInput.schema';
import { OrderItemCreateOrConnectWithoutChildOrderItemsInputObjectSchema as OrderItemCreateOrConnectWithoutChildOrderItemsInputObjectSchema } from './OrderItemCreateOrConnectWithoutChildOrderItemsInput.schema';
import { OrderItemWhereUniqueInputObjectSchema as OrderItemWhereUniqueInputObjectSchema } from './OrderItemWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => OrderItemCreateWithoutChildOrderItemsInputObjectSchema), z.lazy(() => OrderItemUncheckedCreateWithoutChildOrderItemsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => OrderItemCreateOrConnectWithoutChildOrderItemsInputObjectSchema).optional(),
  connect: z.lazy(() => OrderItemWhereUniqueInputObjectSchema).optional()
}).strict();
export const OrderItemCreateNestedOneWithoutChildOrderItemsInputObjectSchema: z.ZodType<Prisma.OrderItemCreateNestedOneWithoutChildOrderItemsInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderItemCreateNestedOneWithoutChildOrderItemsInput>;
export const OrderItemCreateNestedOneWithoutChildOrderItemsInputObjectZodSchema = makeSchema();
