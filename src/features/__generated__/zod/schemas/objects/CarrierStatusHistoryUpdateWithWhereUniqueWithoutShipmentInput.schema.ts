import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CarrierStatusHistoryWhereUniqueInputObjectSchema as CarrierStatusHistoryWhereUniqueInputObjectSchema } from './CarrierStatusHistoryWhereUniqueInput.schema';
import { CarrierStatusHistoryUpdateWithoutShipmentInputObjectSchema as CarrierStatusHistoryUpdateWithoutShipmentInputObjectSchema } from './CarrierStatusHistoryUpdateWithoutShipmentInput.schema';
import { CarrierStatusHistoryUncheckedUpdateWithoutShipmentInputObjectSchema as CarrierStatusHistoryUncheckedUpdateWithoutShipmentInputObjectSchema } from './CarrierStatusHistoryUncheckedUpdateWithoutShipmentInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => CarrierStatusHistoryWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => CarrierStatusHistoryUpdateWithoutShipmentInputObjectSchema), z.lazy(() => CarrierStatusHistoryUncheckedUpdateWithoutShipmentInputObjectSchema)])
}).strict();
export const CarrierStatusHistoryUpdateWithWhereUniqueWithoutShipmentInputObjectSchema: z.ZodType<Prisma.CarrierStatusHistoryUpdateWithWhereUniqueWithoutShipmentInput> = makeSchema() as unknown as z.ZodType<Prisma.CarrierStatusHistoryUpdateWithWhereUniqueWithoutShipmentInput>;
export const CarrierStatusHistoryUpdateWithWhereUniqueWithoutShipmentInputObjectZodSchema = makeSchema();
