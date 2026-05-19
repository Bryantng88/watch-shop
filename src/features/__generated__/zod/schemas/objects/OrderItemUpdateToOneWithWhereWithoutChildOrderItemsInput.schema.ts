import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderItemWhereInputObjectSchema as OrderItemWhereInputObjectSchema } from './OrderItemWhereInput.schema';
import { OrderItemUpdateWithoutChildOrderItemsInputObjectSchema as OrderItemUpdateWithoutChildOrderItemsInputObjectSchema } from './OrderItemUpdateWithoutChildOrderItemsInput.schema';
import { OrderItemUncheckedUpdateWithoutChildOrderItemsInputObjectSchema as OrderItemUncheckedUpdateWithoutChildOrderItemsInputObjectSchema } from './OrderItemUncheckedUpdateWithoutChildOrderItemsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => OrderItemWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => OrderItemUpdateWithoutChildOrderItemsInputObjectSchema), z.lazy(() => OrderItemUncheckedUpdateWithoutChildOrderItemsInputObjectSchema)])
}).strict();
export const OrderItemUpdateToOneWithWhereWithoutChildOrderItemsInputObjectSchema: z.ZodType<Prisma.OrderItemUpdateToOneWithWhereWithoutChildOrderItemsInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderItemUpdateToOneWithWhereWithoutChildOrderItemsInput>;
export const OrderItemUpdateToOneWithWhereWithoutChildOrderItemsInputObjectZodSchema = makeSchema();
