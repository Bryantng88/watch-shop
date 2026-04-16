import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderItemUpdateWithoutOther_OrderItemInputObjectSchema as OrderItemUpdateWithoutOther_OrderItemInputObjectSchema } from './OrderItemUpdateWithoutOther_OrderItemInput.schema';
import { OrderItemUncheckedUpdateWithoutOther_OrderItemInputObjectSchema as OrderItemUncheckedUpdateWithoutOther_OrderItemInputObjectSchema } from './OrderItemUncheckedUpdateWithoutOther_OrderItemInput.schema';
import { OrderItemCreateWithoutOther_OrderItemInputObjectSchema as OrderItemCreateWithoutOther_OrderItemInputObjectSchema } from './OrderItemCreateWithoutOther_OrderItemInput.schema';
import { OrderItemUncheckedCreateWithoutOther_OrderItemInputObjectSchema as OrderItemUncheckedCreateWithoutOther_OrderItemInputObjectSchema } from './OrderItemUncheckedCreateWithoutOther_OrderItemInput.schema';
import { OrderItemWhereInputObjectSchema as OrderItemWhereInputObjectSchema } from './OrderItemWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => OrderItemUpdateWithoutOther_OrderItemInputObjectSchema), z.lazy(() => OrderItemUncheckedUpdateWithoutOther_OrderItemInputObjectSchema)]),
  create: z.union([z.lazy(() => OrderItemCreateWithoutOther_OrderItemInputObjectSchema), z.lazy(() => OrderItemUncheckedCreateWithoutOther_OrderItemInputObjectSchema)]),
  where: z.lazy(() => OrderItemWhereInputObjectSchema).optional()
}).strict();
export const OrderItemUpsertWithoutOther_OrderItemInputObjectSchema: z.ZodType<Prisma.OrderItemUpsertWithoutOther_OrderItemInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderItemUpsertWithoutOther_OrderItemInput>;
export const OrderItemUpsertWithoutOther_OrderItemInputObjectZodSchema = makeSchema();
