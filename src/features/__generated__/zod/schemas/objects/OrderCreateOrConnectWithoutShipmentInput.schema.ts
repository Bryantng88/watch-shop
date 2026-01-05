import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderWhereUniqueInputObjectSchema as OrderWhereUniqueInputObjectSchema } from './OrderWhereUniqueInput.schema';
import { OrderCreateWithoutShipmentInputObjectSchema as OrderCreateWithoutShipmentInputObjectSchema } from './OrderCreateWithoutShipmentInput.schema';
import { OrderUncheckedCreateWithoutShipmentInputObjectSchema as OrderUncheckedCreateWithoutShipmentInputObjectSchema } from './OrderUncheckedCreateWithoutShipmentInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => OrderWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => OrderCreateWithoutShipmentInputObjectSchema), z.lazy(() => OrderUncheckedCreateWithoutShipmentInputObjectSchema)])
}).strict();
export const OrderCreateOrConnectWithoutShipmentInputObjectSchema: z.ZodType<Prisma.OrderCreateOrConnectWithoutShipmentInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderCreateOrConnectWithoutShipmentInput>;
export const OrderCreateOrConnectWithoutShipmentInputObjectZodSchema = makeSchema();
