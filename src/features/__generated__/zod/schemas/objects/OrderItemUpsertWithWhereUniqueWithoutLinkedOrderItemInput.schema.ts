import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderItemWhereUniqueInputObjectSchema as OrderItemWhereUniqueInputObjectSchema } from './OrderItemWhereUniqueInput.schema';
import { OrderItemUpdateWithoutLinkedOrderItemInputObjectSchema as OrderItemUpdateWithoutLinkedOrderItemInputObjectSchema } from './OrderItemUpdateWithoutLinkedOrderItemInput.schema';
import { OrderItemUncheckedUpdateWithoutLinkedOrderItemInputObjectSchema as OrderItemUncheckedUpdateWithoutLinkedOrderItemInputObjectSchema } from './OrderItemUncheckedUpdateWithoutLinkedOrderItemInput.schema';
import { OrderItemCreateWithoutLinkedOrderItemInputObjectSchema as OrderItemCreateWithoutLinkedOrderItemInputObjectSchema } from './OrderItemCreateWithoutLinkedOrderItemInput.schema';
import { OrderItemUncheckedCreateWithoutLinkedOrderItemInputObjectSchema as OrderItemUncheckedCreateWithoutLinkedOrderItemInputObjectSchema } from './OrderItemUncheckedCreateWithoutLinkedOrderItemInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => OrderItemWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => OrderItemUpdateWithoutLinkedOrderItemInputObjectSchema), z.lazy(() => OrderItemUncheckedUpdateWithoutLinkedOrderItemInputObjectSchema)]),
  create: z.union([z.lazy(() => OrderItemCreateWithoutLinkedOrderItemInputObjectSchema), z.lazy(() => OrderItemUncheckedCreateWithoutLinkedOrderItemInputObjectSchema)])
}).strict();
export const OrderItemUpsertWithWhereUniqueWithoutLinkedOrderItemInputObjectSchema: z.ZodType<Prisma.OrderItemUpsertWithWhereUniqueWithoutLinkedOrderItemInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderItemUpsertWithWhereUniqueWithoutLinkedOrderItemInput>;
export const OrderItemUpsertWithWhereUniqueWithoutLinkedOrderItemInputObjectZodSchema = makeSchema();
