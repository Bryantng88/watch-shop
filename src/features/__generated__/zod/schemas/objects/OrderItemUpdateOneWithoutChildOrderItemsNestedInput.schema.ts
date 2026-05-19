import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderItemCreateWithoutChildOrderItemsInputObjectSchema as OrderItemCreateWithoutChildOrderItemsInputObjectSchema } from './OrderItemCreateWithoutChildOrderItemsInput.schema';
import { OrderItemUncheckedCreateWithoutChildOrderItemsInputObjectSchema as OrderItemUncheckedCreateWithoutChildOrderItemsInputObjectSchema } from './OrderItemUncheckedCreateWithoutChildOrderItemsInput.schema';
import { OrderItemCreateOrConnectWithoutChildOrderItemsInputObjectSchema as OrderItemCreateOrConnectWithoutChildOrderItemsInputObjectSchema } from './OrderItemCreateOrConnectWithoutChildOrderItemsInput.schema';
import { OrderItemUpsertWithoutChildOrderItemsInputObjectSchema as OrderItemUpsertWithoutChildOrderItemsInputObjectSchema } from './OrderItemUpsertWithoutChildOrderItemsInput.schema';
import { OrderItemWhereInputObjectSchema as OrderItemWhereInputObjectSchema } from './OrderItemWhereInput.schema';
import { OrderItemWhereUniqueInputObjectSchema as OrderItemWhereUniqueInputObjectSchema } from './OrderItemWhereUniqueInput.schema';
import { OrderItemUpdateToOneWithWhereWithoutChildOrderItemsInputObjectSchema as OrderItemUpdateToOneWithWhereWithoutChildOrderItemsInputObjectSchema } from './OrderItemUpdateToOneWithWhereWithoutChildOrderItemsInput.schema';
import { OrderItemUpdateWithoutChildOrderItemsInputObjectSchema as OrderItemUpdateWithoutChildOrderItemsInputObjectSchema } from './OrderItemUpdateWithoutChildOrderItemsInput.schema';
import { OrderItemUncheckedUpdateWithoutChildOrderItemsInputObjectSchema as OrderItemUncheckedUpdateWithoutChildOrderItemsInputObjectSchema } from './OrderItemUncheckedUpdateWithoutChildOrderItemsInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => OrderItemCreateWithoutChildOrderItemsInputObjectSchema), z.lazy(() => OrderItemUncheckedCreateWithoutChildOrderItemsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => OrderItemCreateOrConnectWithoutChildOrderItemsInputObjectSchema).optional(),
  upsert: z.lazy(() => OrderItemUpsertWithoutChildOrderItemsInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => OrderItemWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => OrderItemWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => OrderItemWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => OrderItemUpdateToOneWithWhereWithoutChildOrderItemsInputObjectSchema), z.lazy(() => OrderItemUpdateWithoutChildOrderItemsInputObjectSchema), z.lazy(() => OrderItemUncheckedUpdateWithoutChildOrderItemsInputObjectSchema)]).optional()
}).strict();
export const OrderItemUpdateOneWithoutChildOrderItemsNestedInputObjectSchema: z.ZodType<Prisma.OrderItemUpdateOneWithoutChildOrderItemsNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderItemUpdateOneWithoutChildOrderItemsNestedInput>;
export const OrderItemUpdateOneWithoutChildOrderItemsNestedInputObjectZodSchema = makeSchema();
