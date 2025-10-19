import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderItemCreateWithoutAcquisitionItemInputObjectSchema as OrderItemCreateWithoutAcquisitionItemInputObjectSchema } from './OrderItemCreateWithoutAcquisitionItemInput.schema';
import { OrderItemUncheckedCreateWithoutAcquisitionItemInputObjectSchema as OrderItemUncheckedCreateWithoutAcquisitionItemInputObjectSchema } from './OrderItemUncheckedCreateWithoutAcquisitionItemInput.schema';
import { OrderItemCreateOrConnectWithoutAcquisitionItemInputObjectSchema as OrderItemCreateOrConnectWithoutAcquisitionItemInputObjectSchema } from './OrderItemCreateOrConnectWithoutAcquisitionItemInput.schema';
import { OrderItemWhereUniqueInputObjectSchema as OrderItemWhereUniqueInputObjectSchema } from './OrderItemWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => OrderItemCreateWithoutAcquisitionItemInputObjectSchema), z.lazy(() => OrderItemUncheckedCreateWithoutAcquisitionItemInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => OrderItemCreateOrConnectWithoutAcquisitionItemInputObjectSchema).optional(),
  connect: z.lazy(() => OrderItemWhereUniqueInputObjectSchema).optional()
}).strict();
export const OrderItemCreateNestedOneWithoutAcquisitionItemInputObjectSchema: z.ZodType<Prisma.OrderItemCreateNestedOneWithoutAcquisitionItemInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderItemCreateNestedOneWithoutAcquisitionItemInput>;
export const OrderItemCreateNestedOneWithoutAcquisitionItemInputObjectZodSchema = makeSchema();
