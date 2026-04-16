import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderItemCreateWithoutOther_OrderItemInputObjectSchema as OrderItemCreateWithoutOther_OrderItemInputObjectSchema } from './OrderItemCreateWithoutOther_OrderItemInput.schema';
import { OrderItemUncheckedCreateWithoutOther_OrderItemInputObjectSchema as OrderItemUncheckedCreateWithoutOther_OrderItemInputObjectSchema } from './OrderItemUncheckedCreateWithoutOther_OrderItemInput.schema';
import { OrderItemCreateOrConnectWithoutOther_OrderItemInputObjectSchema as OrderItemCreateOrConnectWithoutOther_OrderItemInputObjectSchema } from './OrderItemCreateOrConnectWithoutOther_OrderItemInput.schema';
import { OrderItemWhereUniqueInputObjectSchema as OrderItemWhereUniqueInputObjectSchema } from './OrderItemWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => OrderItemCreateWithoutOther_OrderItemInputObjectSchema), z.lazy(() => OrderItemUncheckedCreateWithoutOther_OrderItemInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => OrderItemCreateOrConnectWithoutOther_OrderItemInputObjectSchema).optional(),
  connect: z.lazy(() => OrderItemWhereUniqueInputObjectSchema).optional()
}).strict();
export const OrderItemCreateNestedOneWithoutOther_OrderItemInputObjectSchema: z.ZodType<Prisma.OrderItemCreateNestedOneWithoutOther_OrderItemInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderItemCreateNestedOneWithoutOther_OrderItemInput>;
export const OrderItemCreateNestedOneWithoutOther_OrderItemInputObjectZodSchema = makeSchema();
