import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CarrierStatusHistoryWhereUniqueInputObjectSchema as CarrierStatusHistoryWhereUniqueInputObjectSchema } from './CarrierStatusHistoryWhereUniqueInput.schema';
import { CarrierStatusHistoryUpdateWithoutShipmentInputObjectSchema as CarrierStatusHistoryUpdateWithoutShipmentInputObjectSchema } from './CarrierStatusHistoryUpdateWithoutShipmentInput.schema';
import { CarrierStatusHistoryUncheckedUpdateWithoutShipmentInputObjectSchema as CarrierStatusHistoryUncheckedUpdateWithoutShipmentInputObjectSchema } from './CarrierStatusHistoryUncheckedUpdateWithoutShipmentInput.schema';
import { CarrierStatusHistoryCreateWithoutShipmentInputObjectSchema as CarrierStatusHistoryCreateWithoutShipmentInputObjectSchema } from './CarrierStatusHistoryCreateWithoutShipmentInput.schema';
import { CarrierStatusHistoryUncheckedCreateWithoutShipmentInputObjectSchema as CarrierStatusHistoryUncheckedCreateWithoutShipmentInputObjectSchema } from './CarrierStatusHistoryUncheckedCreateWithoutShipmentInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => CarrierStatusHistoryWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => CarrierStatusHistoryUpdateWithoutShipmentInputObjectSchema), z.lazy(() => CarrierStatusHistoryUncheckedUpdateWithoutShipmentInputObjectSchema)]),
  create: z.union([z.lazy(() => CarrierStatusHistoryCreateWithoutShipmentInputObjectSchema), z.lazy(() => CarrierStatusHistoryUncheckedCreateWithoutShipmentInputObjectSchema)])
}).strict();
export const CarrierStatusHistoryUpsertWithWhereUniqueWithoutShipmentInputObjectSchema: z.ZodType<Prisma.CarrierStatusHistoryUpsertWithWhereUniqueWithoutShipmentInput> = makeSchema() as unknown as z.ZodType<Prisma.CarrierStatusHistoryUpsertWithWhereUniqueWithoutShipmentInput>;
export const CarrierStatusHistoryUpsertWithWhereUniqueWithoutShipmentInputObjectZodSchema = makeSchema();
