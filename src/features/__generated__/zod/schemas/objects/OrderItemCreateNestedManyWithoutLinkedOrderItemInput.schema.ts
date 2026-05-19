import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderItemCreateWithoutLinkedOrderItemInputObjectSchema as OrderItemCreateWithoutLinkedOrderItemInputObjectSchema } from './OrderItemCreateWithoutLinkedOrderItemInput.schema';
import { OrderItemUncheckedCreateWithoutLinkedOrderItemInputObjectSchema as OrderItemUncheckedCreateWithoutLinkedOrderItemInputObjectSchema } from './OrderItemUncheckedCreateWithoutLinkedOrderItemInput.schema';
import { OrderItemCreateOrConnectWithoutLinkedOrderItemInputObjectSchema as OrderItemCreateOrConnectWithoutLinkedOrderItemInputObjectSchema } from './OrderItemCreateOrConnectWithoutLinkedOrderItemInput.schema';
import { OrderItemCreateManyLinkedOrderItemInputEnvelopeObjectSchema as OrderItemCreateManyLinkedOrderItemInputEnvelopeObjectSchema } from './OrderItemCreateManyLinkedOrderItemInputEnvelope.schema';
import { OrderItemWhereUniqueInputObjectSchema as OrderItemWhereUniqueInputObjectSchema } from './OrderItemWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => OrderItemCreateWithoutLinkedOrderItemInputObjectSchema), z.lazy(() => OrderItemCreateWithoutLinkedOrderItemInputObjectSchema).array(), z.lazy(() => OrderItemUncheckedCreateWithoutLinkedOrderItemInputObjectSchema), z.lazy(() => OrderItemUncheckedCreateWithoutLinkedOrderItemInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => OrderItemCreateOrConnectWithoutLinkedOrderItemInputObjectSchema), z.lazy(() => OrderItemCreateOrConnectWithoutLinkedOrderItemInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => OrderItemCreateManyLinkedOrderItemInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => OrderItemWhereUniqueInputObjectSchema), z.lazy(() => OrderItemWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const OrderItemCreateNestedManyWithoutLinkedOrderItemInputObjectSchema: z.ZodType<Prisma.OrderItemCreateNestedManyWithoutLinkedOrderItemInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderItemCreateNestedManyWithoutLinkedOrderItemInput>;
export const OrderItemCreateNestedManyWithoutLinkedOrderItemInputObjectZodSchema = makeSchema();
