import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderItemWhereInputObjectSchema as OrderItemWhereInputObjectSchema } from './OrderItemWhereInput.schema';
import { OrderItemUpdateWithoutOther_OrderItemInputObjectSchema as OrderItemUpdateWithoutOther_OrderItemInputObjectSchema } from './OrderItemUpdateWithoutOther_OrderItemInput.schema';
import { OrderItemUncheckedUpdateWithoutOther_OrderItemInputObjectSchema as OrderItemUncheckedUpdateWithoutOther_OrderItemInputObjectSchema } from './OrderItemUncheckedUpdateWithoutOther_OrderItemInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => OrderItemWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => OrderItemUpdateWithoutOther_OrderItemInputObjectSchema), z.lazy(() => OrderItemUncheckedUpdateWithoutOther_OrderItemInputObjectSchema)])
}).strict();
export const OrderItemUpdateToOneWithWhereWithoutOther_OrderItemInputObjectSchema: z.ZodType<Prisma.OrderItemUpdateToOneWithWhereWithoutOther_OrderItemInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderItemUpdateToOneWithWhereWithoutOther_OrderItemInput>;
export const OrderItemUpdateToOneWithWhereWithoutOther_OrderItemInputObjectZodSchema = makeSchema();
