import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderCreateWithoutShipmentInputObjectSchema as OrderCreateWithoutShipmentInputObjectSchema } from './OrderCreateWithoutShipmentInput.schema';
import { OrderUncheckedCreateWithoutShipmentInputObjectSchema as OrderUncheckedCreateWithoutShipmentInputObjectSchema } from './OrderUncheckedCreateWithoutShipmentInput.schema';
import { OrderCreateOrConnectWithoutShipmentInputObjectSchema as OrderCreateOrConnectWithoutShipmentInputObjectSchema } from './OrderCreateOrConnectWithoutShipmentInput.schema';
import { OrderWhereUniqueInputObjectSchema as OrderWhereUniqueInputObjectSchema } from './OrderWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => OrderCreateWithoutShipmentInputObjectSchema), z.lazy(() => OrderUncheckedCreateWithoutShipmentInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => OrderCreateOrConnectWithoutShipmentInputObjectSchema).optional(),
  connect: z.lazy(() => OrderWhereUniqueInputObjectSchema).optional()
}).strict();
export const OrderCreateNestedOneWithoutShipmentInputObjectSchema: z.ZodType<Prisma.OrderCreateNestedOneWithoutShipmentInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderCreateNestedOneWithoutShipmentInput>;
export const OrderCreateNestedOneWithoutShipmentInputObjectZodSchema = makeSchema();
