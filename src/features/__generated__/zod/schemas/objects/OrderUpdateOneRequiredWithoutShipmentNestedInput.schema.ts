import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderCreateWithoutShipmentInputObjectSchema as OrderCreateWithoutShipmentInputObjectSchema } from './OrderCreateWithoutShipmentInput.schema';
import { OrderUncheckedCreateWithoutShipmentInputObjectSchema as OrderUncheckedCreateWithoutShipmentInputObjectSchema } from './OrderUncheckedCreateWithoutShipmentInput.schema';
import { OrderCreateOrConnectWithoutShipmentInputObjectSchema as OrderCreateOrConnectWithoutShipmentInputObjectSchema } from './OrderCreateOrConnectWithoutShipmentInput.schema';
import { OrderUpsertWithoutShipmentInputObjectSchema as OrderUpsertWithoutShipmentInputObjectSchema } from './OrderUpsertWithoutShipmentInput.schema';
import { OrderWhereUniqueInputObjectSchema as OrderWhereUniqueInputObjectSchema } from './OrderWhereUniqueInput.schema';
import { OrderUpdateToOneWithWhereWithoutShipmentInputObjectSchema as OrderUpdateToOneWithWhereWithoutShipmentInputObjectSchema } from './OrderUpdateToOneWithWhereWithoutShipmentInput.schema';
import { OrderUpdateWithoutShipmentInputObjectSchema as OrderUpdateWithoutShipmentInputObjectSchema } from './OrderUpdateWithoutShipmentInput.schema';
import { OrderUncheckedUpdateWithoutShipmentInputObjectSchema as OrderUncheckedUpdateWithoutShipmentInputObjectSchema } from './OrderUncheckedUpdateWithoutShipmentInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => OrderCreateWithoutShipmentInputObjectSchema), z.lazy(() => OrderUncheckedCreateWithoutShipmentInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => OrderCreateOrConnectWithoutShipmentInputObjectSchema).optional(),
  upsert: z.lazy(() => OrderUpsertWithoutShipmentInputObjectSchema).optional(),
  connect: z.lazy(() => OrderWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => OrderUpdateToOneWithWhereWithoutShipmentInputObjectSchema), z.lazy(() => OrderUpdateWithoutShipmentInputObjectSchema), z.lazy(() => OrderUncheckedUpdateWithoutShipmentInputObjectSchema)]).optional()
}).strict();
export const OrderUpdateOneRequiredWithoutShipmentNestedInputObjectSchema: z.ZodType<Prisma.OrderUpdateOneRequiredWithoutShipmentNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderUpdateOneRequiredWithoutShipmentNestedInput>;
export const OrderUpdateOneRequiredWithoutShipmentNestedInputObjectZodSchema = makeSchema();
