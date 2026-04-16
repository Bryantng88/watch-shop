import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderWhereInputObjectSchema as OrderWhereInputObjectSchema } from './OrderWhereInput.schema';
import { OrderUpdateWithoutShipmentInputObjectSchema as OrderUpdateWithoutShipmentInputObjectSchema } from './OrderUpdateWithoutShipmentInput.schema';
import { OrderUncheckedUpdateWithoutShipmentInputObjectSchema as OrderUncheckedUpdateWithoutShipmentInputObjectSchema } from './OrderUncheckedUpdateWithoutShipmentInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => OrderWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => OrderUpdateWithoutShipmentInputObjectSchema), z.lazy(() => OrderUncheckedUpdateWithoutShipmentInputObjectSchema)])
}).strict();
export const OrderUpdateToOneWithWhereWithoutShipmentInputObjectSchema: z.ZodType<Prisma.OrderUpdateToOneWithWhereWithoutShipmentInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderUpdateToOneWithWhereWithoutShipmentInput>;
export const OrderUpdateToOneWithWhereWithoutShipmentInputObjectZodSchema = makeSchema();
