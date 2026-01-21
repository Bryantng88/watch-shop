import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderItemWhereUniqueInputObjectSchema as OrderItemWhereUniqueInputObjectSchema } from './OrderItemWhereUniqueInput.schema';
import { OrderItemUpdateWithoutOrderItemInputObjectSchema as OrderItemUpdateWithoutOrderItemInputObjectSchema } from './OrderItemUpdateWithoutOrderItemInput.schema';
import { OrderItemUncheckedUpdateWithoutOrderItemInputObjectSchema as OrderItemUncheckedUpdateWithoutOrderItemInputObjectSchema } from './OrderItemUncheckedUpdateWithoutOrderItemInput.schema';
import { OrderItemCreateWithoutOrderItemInputObjectSchema as OrderItemCreateWithoutOrderItemInputObjectSchema } from './OrderItemCreateWithoutOrderItemInput.schema';
import { OrderItemUncheckedCreateWithoutOrderItemInputObjectSchema as OrderItemUncheckedCreateWithoutOrderItemInputObjectSchema } from './OrderItemUncheckedCreateWithoutOrderItemInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => OrderItemWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => OrderItemUpdateWithoutOrderItemInputObjectSchema), z.lazy(() => OrderItemUncheckedUpdateWithoutOrderItemInputObjectSchema)]),
  create: z.union([z.lazy(() => OrderItemCreateWithoutOrderItemInputObjectSchema), z.lazy(() => OrderItemUncheckedCreateWithoutOrderItemInputObjectSchema)])
}).strict();
export const OrderItemUpsertWithWhereUniqueWithoutOrderItemInputObjectSchema: z.ZodType<Prisma.OrderItemUpsertWithWhereUniqueWithoutOrderItemInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderItemUpsertWithWhereUniqueWithoutOrderItemInput>;
export const OrderItemUpsertWithWhereUniqueWithoutOrderItemInputObjectZodSchema = makeSchema();
