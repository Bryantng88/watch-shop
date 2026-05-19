import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderItemUpdateWithoutChildOrderItemsInputObjectSchema as OrderItemUpdateWithoutChildOrderItemsInputObjectSchema } from './OrderItemUpdateWithoutChildOrderItemsInput.schema';
import { OrderItemUncheckedUpdateWithoutChildOrderItemsInputObjectSchema as OrderItemUncheckedUpdateWithoutChildOrderItemsInputObjectSchema } from './OrderItemUncheckedUpdateWithoutChildOrderItemsInput.schema';
import { OrderItemCreateWithoutChildOrderItemsInputObjectSchema as OrderItemCreateWithoutChildOrderItemsInputObjectSchema } from './OrderItemCreateWithoutChildOrderItemsInput.schema';
import { OrderItemUncheckedCreateWithoutChildOrderItemsInputObjectSchema as OrderItemUncheckedCreateWithoutChildOrderItemsInputObjectSchema } from './OrderItemUncheckedCreateWithoutChildOrderItemsInput.schema';
import { OrderItemWhereInputObjectSchema as OrderItemWhereInputObjectSchema } from './OrderItemWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => OrderItemUpdateWithoutChildOrderItemsInputObjectSchema), z.lazy(() => OrderItemUncheckedUpdateWithoutChildOrderItemsInputObjectSchema)]),
  create: z.union([z.lazy(() => OrderItemCreateWithoutChildOrderItemsInputObjectSchema), z.lazy(() => OrderItemUncheckedCreateWithoutChildOrderItemsInputObjectSchema)]),
  where: z.lazy(() => OrderItemWhereInputObjectSchema).optional()
}).strict();
export const OrderItemUpsertWithoutChildOrderItemsInputObjectSchema: z.ZodType<Prisma.OrderItemUpsertWithoutChildOrderItemsInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderItemUpsertWithoutChildOrderItemsInput>;
export const OrderItemUpsertWithoutChildOrderItemsInputObjectZodSchema = makeSchema();
