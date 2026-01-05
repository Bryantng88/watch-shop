import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderUpdateWithoutShipmentInputObjectSchema as OrderUpdateWithoutShipmentInputObjectSchema } from './OrderUpdateWithoutShipmentInput.schema';
import { OrderUncheckedUpdateWithoutShipmentInputObjectSchema as OrderUncheckedUpdateWithoutShipmentInputObjectSchema } from './OrderUncheckedUpdateWithoutShipmentInput.schema';
import { OrderCreateWithoutShipmentInputObjectSchema as OrderCreateWithoutShipmentInputObjectSchema } from './OrderCreateWithoutShipmentInput.schema';
import { OrderUncheckedCreateWithoutShipmentInputObjectSchema as OrderUncheckedCreateWithoutShipmentInputObjectSchema } from './OrderUncheckedCreateWithoutShipmentInput.schema';
import { OrderWhereInputObjectSchema as OrderWhereInputObjectSchema } from './OrderWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => OrderUpdateWithoutShipmentInputObjectSchema), z.lazy(() => OrderUncheckedUpdateWithoutShipmentInputObjectSchema)]),
  create: z.union([z.lazy(() => OrderCreateWithoutShipmentInputObjectSchema), z.lazy(() => OrderUncheckedCreateWithoutShipmentInputObjectSchema)]),
  where: z.lazy(() => OrderWhereInputObjectSchema).optional()
}).strict();
export const OrderUpsertWithoutShipmentInputObjectSchema: z.ZodType<Prisma.OrderUpsertWithoutShipmentInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderUpsertWithoutShipmentInput>;
export const OrderUpsertWithoutShipmentInputObjectZodSchema = makeSchema();
