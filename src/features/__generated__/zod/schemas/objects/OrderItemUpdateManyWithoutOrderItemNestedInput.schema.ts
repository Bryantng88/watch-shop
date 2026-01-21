import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderItemCreateWithoutOrderItemInputObjectSchema as OrderItemCreateWithoutOrderItemInputObjectSchema } from './OrderItemCreateWithoutOrderItemInput.schema';
import { OrderItemUncheckedCreateWithoutOrderItemInputObjectSchema as OrderItemUncheckedCreateWithoutOrderItemInputObjectSchema } from './OrderItemUncheckedCreateWithoutOrderItemInput.schema';
import { OrderItemCreateOrConnectWithoutOrderItemInputObjectSchema as OrderItemCreateOrConnectWithoutOrderItemInputObjectSchema } from './OrderItemCreateOrConnectWithoutOrderItemInput.schema';
import { OrderItemUpsertWithWhereUniqueWithoutOrderItemInputObjectSchema as OrderItemUpsertWithWhereUniqueWithoutOrderItemInputObjectSchema } from './OrderItemUpsertWithWhereUniqueWithoutOrderItemInput.schema';
import { OrderItemCreateManyOrderItemInputEnvelopeObjectSchema as OrderItemCreateManyOrderItemInputEnvelopeObjectSchema } from './OrderItemCreateManyOrderItemInputEnvelope.schema';
import { OrderItemWhereUniqueInputObjectSchema as OrderItemWhereUniqueInputObjectSchema } from './OrderItemWhereUniqueInput.schema';
import { OrderItemUpdateWithWhereUniqueWithoutOrderItemInputObjectSchema as OrderItemUpdateWithWhereUniqueWithoutOrderItemInputObjectSchema } from './OrderItemUpdateWithWhereUniqueWithoutOrderItemInput.schema';
import { OrderItemUpdateManyWithWhereWithoutOrderItemInputObjectSchema as OrderItemUpdateManyWithWhereWithoutOrderItemInputObjectSchema } from './OrderItemUpdateManyWithWhereWithoutOrderItemInput.schema';
import { OrderItemScalarWhereInputObjectSchema as OrderItemScalarWhereInputObjectSchema } from './OrderItemScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => OrderItemCreateWithoutOrderItemInputObjectSchema), z.lazy(() => OrderItemCreateWithoutOrderItemInputObjectSchema).array(), z.lazy(() => OrderItemUncheckedCreateWithoutOrderItemInputObjectSchema), z.lazy(() => OrderItemUncheckedCreateWithoutOrderItemInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => OrderItemCreateOrConnectWithoutOrderItemInputObjectSchema), z.lazy(() => OrderItemCreateOrConnectWithoutOrderItemInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => OrderItemUpsertWithWhereUniqueWithoutOrderItemInputObjectSchema), z.lazy(() => OrderItemUpsertWithWhereUniqueWithoutOrderItemInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => OrderItemCreateManyOrderItemInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => OrderItemWhereUniqueInputObjectSchema), z.lazy(() => OrderItemWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => OrderItemWhereUniqueInputObjectSchema), z.lazy(() => OrderItemWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => OrderItemWhereUniqueInputObjectSchema), z.lazy(() => OrderItemWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => OrderItemWhereUniqueInputObjectSchema), z.lazy(() => OrderItemWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => OrderItemUpdateWithWhereUniqueWithoutOrderItemInputObjectSchema), z.lazy(() => OrderItemUpdateWithWhereUniqueWithoutOrderItemInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => OrderItemUpdateManyWithWhereWithoutOrderItemInputObjectSchema), z.lazy(() => OrderItemUpdateManyWithWhereWithoutOrderItemInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => OrderItemScalarWhereInputObjectSchema), z.lazy(() => OrderItemScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const OrderItemUpdateManyWithoutOrderItemNestedInputObjectSchema: z.ZodType<Prisma.OrderItemUpdateManyWithoutOrderItemNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderItemUpdateManyWithoutOrderItemNestedInput>;
export const OrderItemUpdateManyWithoutOrderItemNestedInputObjectZodSchema = makeSchema();
