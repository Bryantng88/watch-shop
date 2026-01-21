import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderItemCreateWithoutOther_OrderItemInputObjectSchema as OrderItemCreateWithoutOther_OrderItemInputObjectSchema } from './OrderItemCreateWithoutOther_OrderItemInput.schema';
import { OrderItemUncheckedCreateWithoutOther_OrderItemInputObjectSchema as OrderItemUncheckedCreateWithoutOther_OrderItemInputObjectSchema } from './OrderItemUncheckedCreateWithoutOther_OrderItemInput.schema';
import { OrderItemCreateOrConnectWithoutOther_OrderItemInputObjectSchema as OrderItemCreateOrConnectWithoutOther_OrderItemInputObjectSchema } from './OrderItemCreateOrConnectWithoutOther_OrderItemInput.schema';
import { OrderItemUpsertWithoutOther_OrderItemInputObjectSchema as OrderItemUpsertWithoutOther_OrderItemInputObjectSchema } from './OrderItemUpsertWithoutOther_OrderItemInput.schema';
import { OrderItemWhereInputObjectSchema as OrderItemWhereInputObjectSchema } from './OrderItemWhereInput.schema';
import { OrderItemWhereUniqueInputObjectSchema as OrderItemWhereUniqueInputObjectSchema } from './OrderItemWhereUniqueInput.schema';
import { OrderItemUpdateToOneWithWhereWithoutOther_OrderItemInputObjectSchema as OrderItemUpdateToOneWithWhereWithoutOther_OrderItemInputObjectSchema } from './OrderItemUpdateToOneWithWhereWithoutOther_OrderItemInput.schema';
import { OrderItemUpdateWithoutOther_OrderItemInputObjectSchema as OrderItemUpdateWithoutOther_OrderItemInputObjectSchema } from './OrderItemUpdateWithoutOther_OrderItemInput.schema';
import { OrderItemUncheckedUpdateWithoutOther_OrderItemInputObjectSchema as OrderItemUncheckedUpdateWithoutOther_OrderItemInputObjectSchema } from './OrderItemUncheckedUpdateWithoutOther_OrderItemInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => OrderItemCreateWithoutOther_OrderItemInputObjectSchema), z.lazy(() => OrderItemUncheckedCreateWithoutOther_OrderItemInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => OrderItemCreateOrConnectWithoutOther_OrderItemInputObjectSchema).optional(),
  upsert: z.lazy(() => OrderItemUpsertWithoutOther_OrderItemInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => OrderItemWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => OrderItemWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => OrderItemWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => OrderItemUpdateToOneWithWhereWithoutOther_OrderItemInputObjectSchema), z.lazy(() => OrderItemUpdateWithoutOther_OrderItemInputObjectSchema), z.lazy(() => OrderItemUncheckedUpdateWithoutOther_OrderItemInputObjectSchema)]).optional()
}).strict();
export const OrderItemUpdateOneWithoutOther_OrderItemNestedInputObjectSchema: z.ZodType<Prisma.OrderItemUpdateOneWithoutOther_OrderItemNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderItemUpdateOneWithoutOther_OrderItemNestedInput>;
export const OrderItemUpdateOneWithoutOther_OrderItemNestedInputObjectZodSchema = makeSchema();
