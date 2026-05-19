import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderItemWhereUniqueInputObjectSchema as OrderItemWhereUniqueInputObjectSchema } from './OrderItemWhereUniqueInput.schema';
import { OrderItemUpdateWithoutLinkedOrderItemInputObjectSchema as OrderItemUpdateWithoutLinkedOrderItemInputObjectSchema } from './OrderItemUpdateWithoutLinkedOrderItemInput.schema';
import { OrderItemUncheckedUpdateWithoutLinkedOrderItemInputObjectSchema as OrderItemUncheckedUpdateWithoutLinkedOrderItemInputObjectSchema } from './OrderItemUncheckedUpdateWithoutLinkedOrderItemInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => OrderItemWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => OrderItemUpdateWithoutLinkedOrderItemInputObjectSchema), z.lazy(() => OrderItemUncheckedUpdateWithoutLinkedOrderItemInputObjectSchema)])
}).strict();
export const OrderItemUpdateWithWhereUniqueWithoutLinkedOrderItemInputObjectSchema: z.ZodType<Prisma.OrderItemUpdateWithWhereUniqueWithoutLinkedOrderItemInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderItemUpdateWithWhereUniqueWithoutLinkedOrderItemInput>;
export const OrderItemUpdateWithWhereUniqueWithoutLinkedOrderItemInputObjectZodSchema = makeSchema();
