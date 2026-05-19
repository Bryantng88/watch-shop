import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderItemCreateWithoutLinkedOrderItemInputObjectSchema as OrderItemCreateWithoutLinkedOrderItemInputObjectSchema } from './OrderItemCreateWithoutLinkedOrderItemInput.schema';
import { OrderItemUncheckedCreateWithoutLinkedOrderItemInputObjectSchema as OrderItemUncheckedCreateWithoutLinkedOrderItemInputObjectSchema } from './OrderItemUncheckedCreateWithoutLinkedOrderItemInput.schema';
import { OrderItemCreateOrConnectWithoutLinkedOrderItemInputObjectSchema as OrderItemCreateOrConnectWithoutLinkedOrderItemInputObjectSchema } from './OrderItemCreateOrConnectWithoutLinkedOrderItemInput.schema';
import { OrderItemUpsertWithWhereUniqueWithoutLinkedOrderItemInputObjectSchema as OrderItemUpsertWithWhereUniqueWithoutLinkedOrderItemInputObjectSchema } from './OrderItemUpsertWithWhereUniqueWithoutLinkedOrderItemInput.schema';
import { OrderItemCreateManyLinkedOrderItemInputEnvelopeObjectSchema as OrderItemCreateManyLinkedOrderItemInputEnvelopeObjectSchema } from './OrderItemCreateManyLinkedOrderItemInputEnvelope.schema';
import { OrderItemWhereUniqueInputObjectSchema as OrderItemWhereUniqueInputObjectSchema } from './OrderItemWhereUniqueInput.schema';
import { OrderItemUpdateWithWhereUniqueWithoutLinkedOrderItemInputObjectSchema as OrderItemUpdateWithWhereUniqueWithoutLinkedOrderItemInputObjectSchema } from './OrderItemUpdateWithWhereUniqueWithoutLinkedOrderItemInput.schema';
import { OrderItemUpdateManyWithWhereWithoutLinkedOrderItemInputObjectSchema as OrderItemUpdateManyWithWhereWithoutLinkedOrderItemInputObjectSchema } from './OrderItemUpdateManyWithWhereWithoutLinkedOrderItemInput.schema';
import { OrderItemScalarWhereInputObjectSchema as OrderItemScalarWhereInputObjectSchema } from './OrderItemScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => OrderItemCreateWithoutLinkedOrderItemInputObjectSchema), z.lazy(() => OrderItemCreateWithoutLinkedOrderItemInputObjectSchema).array(), z.lazy(() => OrderItemUncheckedCreateWithoutLinkedOrderItemInputObjectSchema), z.lazy(() => OrderItemUncheckedCreateWithoutLinkedOrderItemInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => OrderItemCreateOrConnectWithoutLinkedOrderItemInputObjectSchema), z.lazy(() => OrderItemCreateOrConnectWithoutLinkedOrderItemInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => OrderItemUpsertWithWhereUniqueWithoutLinkedOrderItemInputObjectSchema), z.lazy(() => OrderItemUpsertWithWhereUniqueWithoutLinkedOrderItemInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => OrderItemCreateManyLinkedOrderItemInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => OrderItemWhereUniqueInputObjectSchema), z.lazy(() => OrderItemWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => OrderItemWhereUniqueInputObjectSchema), z.lazy(() => OrderItemWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => OrderItemWhereUniqueInputObjectSchema), z.lazy(() => OrderItemWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => OrderItemWhereUniqueInputObjectSchema), z.lazy(() => OrderItemWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => OrderItemUpdateWithWhereUniqueWithoutLinkedOrderItemInputObjectSchema), z.lazy(() => OrderItemUpdateWithWhereUniqueWithoutLinkedOrderItemInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => OrderItemUpdateManyWithWhereWithoutLinkedOrderItemInputObjectSchema), z.lazy(() => OrderItemUpdateManyWithWhereWithoutLinkedOrderItemInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => OrderItemScalarWhereInputObjectSchema), z.lazy(() => OrderItemScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const OrderItemUpdateManyWithoutLinkedOrderItemNestedInputObjectSchema: z.ZodType<Prisma.OrderItemUpdateManyWithoutLinkedOrderItemNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderItemUpdateManyWithoutLinkedOrderItemNestedInput>;
export const OrderItemUpdateManyWithoutLinkedOrderItemNestedInputObjectZodSchema = makeSchema();
