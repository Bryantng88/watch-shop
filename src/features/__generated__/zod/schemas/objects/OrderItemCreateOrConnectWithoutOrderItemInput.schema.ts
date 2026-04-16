import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderItemWhereUniqueInputObjectSchema as OrderItemWhereUniqueInputObjectSchema } from './OrderItemWhereUniqueInput.schema';
import { OrderItemCreateWithoutOrderItemInputObjectSchema as OrderItemCreateWithoutOrderItemInputObjectSchema } from './OrderItemCreateWithoutOrderItemInput.schema';
import { OrderItemUncheckedCreateWithoutOrderItemInputObjectSchema as OrderItemUncheckedCreateWithoutOrderItemInputObjectSchema } from './OrderItemUncheckedCreateWithoutOrderItemInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => OrderItemWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => OrderItemCreateWithoutOrderItemInputObjectSchema), z.lazy(() => OrderItemUncheckedCreateWithoutOrderItemInputObjectSchema)])
}).strict();
export const OrderItemCreateOrConnectWithoutOrderItemInputObjectSchema: z.ZodType<Prisma.OrderItemCreateOrConnectWithoutOrderItemInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderItemCreateOrConnectWithoutOrderItemInput>;
export const OrderItemCreateOrConnectWithoutOrderItemInputObjectZodSchema = makeSchema();
