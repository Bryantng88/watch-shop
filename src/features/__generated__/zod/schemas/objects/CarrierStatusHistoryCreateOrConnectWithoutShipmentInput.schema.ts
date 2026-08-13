import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CarrierStatusHistoryWhereUniqueInputObjectSchema as CarrierStatusHistoryWhereUniqueInputObjectSchema } from './CarrierStatusHistoryWhereUniqueInput.schema';
import { CarrierStatusHistoryCreateWithoutShipmentInputObjectSchema as CarrierStatusHistoryCreateWithoutShipmentInputObjectSchema } from './CarrierStatusHistoryCreateWithoutShipmentInput.schema';
import { CarrierStatusHistoryUncheckedCreateWithoutShipmentInputObjectSchema as CarrierStatusHistoryUncheckedCreateWithoutShipmentInputObjectSchema } from './CarrierStatusHistoryUncheckedCreateWithoutShipmentInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => CarrierStatusHistoryWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => CarrierStatusHistoryCreateWithoutShipmentInputObjectSchema), z.lazy(() => CarrierStatusHistoryUncheckedCreateWithoutShipmentInputObjectSchema)])
}).strict();
export const CarrierStatusHistoryCreateOrConnectWithoutShipmentInputObjectSchema: z.ZodType<Prisma.CarrierStatusHistoryCreateOrConnectWithoutShipmentInput> = makeSchema() as unknown as z.ZodType<Prisma.CarrierStatusHistoryCreateOrConnectWithoutShipmentInput>;
export const CarrierStatusHistoryCreateOrConnectWithoutShipmentInputObjectZodSchema = makeSchema();
