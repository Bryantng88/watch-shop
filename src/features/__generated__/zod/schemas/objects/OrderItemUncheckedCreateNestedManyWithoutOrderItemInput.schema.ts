import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderItemCreateWithoutOrderItemInputObjectSchema as OrderItemCreateWithoutOrderItemInputObjectSchema } from './OrderItemCreateWithoutOrderItemInput.schema';
import { OrderItemUncheckedCreateWithoutOrderItemInputObjectSchema as OrderItemUncheckedCreateWithoutOrderItemInputObjectSchema } from './OrderItemUncheckedCreateWithoutOrderItemInput.schema';
import { OrderItemCreateOrConnectWithoutOrderItemInputObjectSchema as OrderItemCreateOrConnectWithoutOrderItemInputObjectSchema } from './OrderItemCreateOrConnectWithoutOrderItemInput.schema';
import { OrderItemCreateManyOrderItemInputEnvelopeObjectSchema as OrderItemCreateManyOrderItemInputEnvelopeObjectSchema } from './OrderItemCreateManyOrderItemInputEnvelope.schema';
import { OrderItemWhereUniqueInputObjectSchema as OrderItemWhereUniqueInputObjectSchema } from './OrderItemWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => OrderItemCreateWithoutOrderItemInputObjectSchema), z.lazy(() => OrderItemCreateWithoutOrderItemInputObjectSchema).array(), z.lazy(() => OrderItemUncheckedCreateWithoutOrderItemInputObjectSchema), z.lazy(() => OrderItemUncheckedCreateWithoutOrderItemInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => OrderItemCreateOrConnectWithoutOrderItemInputObjectSchema), z.lazy(() => OrderItemCreateOrConnectWithoutOrderItemInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => OrderItemCreateManyOrderItemInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => OrderItemWhereUniqueInputObjectSchema), z.lazy(() => OrderItemWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const OrderItemUncheckedCreateNestedManyWithoutOrderItemInputObjectSchema: z.ZodType<Prisma.OrderItemUncheckedCreateNestedManyWithoutOrderItemInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderItemUncheckedCreateNestedManyWithoutOrderItemInput>;
export const OrderItemUncheckedCreateNestedManyWithoutOrderItemInputObjectZodSchema = makeSchema();
