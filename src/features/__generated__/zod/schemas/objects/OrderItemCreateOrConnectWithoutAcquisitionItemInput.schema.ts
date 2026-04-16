import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderItemWhereUniqueInputObjectSchema as OrderItemWhereUniqueInputObjectSchema } from './OrderItemWhereUniqueInput.schema';
import { OrderItemCreateWithoutAcquisitionItemInputObjectSchema as OrderItemCreateWithoutAcquisitionItemInputObjectSchema } from './OrderItemCreateWithoutAcquisitionItemInput.schema';
import { OrderItemUncheckedCreateWithoutAcquisitionItemInputObjectSchema as OrderItemUncheckedCreateWithoutAcquisitionItemInputObjectSchema } from './OrderItemUncheckedCreateWithoutAcquisitionItemInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => OrderItemWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => OrderItemCreateWithoutAcquisitionItemInputObjectSchema), z.lazy(() => OrderItemUncheckedCreateWithoutAcquisitionItemInputObjectSchema)])
}).strict();
export const OrderItemCreateOrConnectWithoutAcquisitionItemInputObjectSchema: z.ZodType<Prisma.OrderItemCreateOrConnectWithoutAcquisitionItemInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderItemCreateOrConnectWithoutAcquisitionItemInput>;
export const OrderItemCreateOrConnectWithoutAcquisitionItemInputObjectZodSchema = makeSchema();
