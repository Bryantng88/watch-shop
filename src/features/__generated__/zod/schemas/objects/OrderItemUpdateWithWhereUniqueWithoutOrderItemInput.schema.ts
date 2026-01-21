import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderItemWhereUniqueInputObjectSchema as OrderItemWhereUniqueInputObjectSchema } from './OrderItemWhereUniqueInput.schema';
import { OrderItemUpdateWithoutOrderItemInputObjectSchema as OrderItemUpdateWithoutOrderItemInputObjectSchema } from './OrderItemUpdateWithoutOrderItemInput.schema';
import { OrderItemUncheckedUpdateWithoutOrderItemInputObjectSchema as OrderItemUncheckedUpdateWithoutOrderItemInputObjectSchema } from './OrderItemUncheckedUpdateWithoutOrderItemInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => OrderItemWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => OrderItemUpdateWithoutOrderItemInputObjectSchema), z.lazy(() => OrderItemUncheckedUpdateWithoutOrderItemInputObjectSchema)])
}).strict();
export const OrderItemUpdateWithWhereUniqueWithoutOrderItemInputObjectSchema: z.ZodType<Prisma.OrderItemUpdateWithWhereUniqueWithoutOrderItemInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderItemUpdateWithWhereUniqueWithoutOrderItemInput>;
export const OrderItemUpdateWithWhereUniqueWithoutOrderItemInputObjectZodSchema = makeSchema();
