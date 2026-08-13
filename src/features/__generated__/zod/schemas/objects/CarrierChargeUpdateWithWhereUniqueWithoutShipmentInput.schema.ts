import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CarrierChargeWhereUniqueInputObjectSchema as CarrierChargeWhereUniqueInputObjectSchema } from './CarrierChargeWhereUniqueInput.schema';
import { CarrierChargeUpdateWithoutShipmentInputObjectSchema as CarrierChargeUpdateWithoutShipmentInputObjectSchema } from './CarrierChargeUpdateWithoutShipmentInput.schema';
import { CarrierChargeUncheckedUpdateWithoutShipmentInputObjectSchema as CarrierChargeUncheckedUpdateWithoutShipmentInputObjectSchema } from './CarrierChargeUncheckedUpdateWithoutShipmentInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => CarrierChargeWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => CarrierChargeUpdateWithoutShipmentInputObjectSchema), z.lazy(() => CarrierChargeUncheckedUpdateWithoutShipmentInputObjectSchema)])
}).strict();
export const CarrierChargeUpdateWithWhereUniqueWithoutShipmentInputObjectSchema: z.ZodType<Prisma.CarrierChargeUpdateWithWhereUniqueWithoutShipmentInput> = makeSchema() as unknown as z.ZodType<Prisma.CarrierChargeUpdateWithWhereUniqueWithoutShipmentInput>;
export const CarrierChargeUpdateWithWhereUniqueWithoutShipmentInputObjectZodSchema = makeSchema();
