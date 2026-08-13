import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CarrierChargeWhereUniqueInputObjectSchema as CarrierChargeWhereUniqueInputObjectSchema } from './CarrierChargeWhereUniqueInput.schema';
import { CarrierChargeUpdateWithoutShipmentInputObjectSchema as CarrierChargeUpdateWithoutShipmentInputObjectSchema } from './CarrierChargeUpdateWithoutShipmentInput.schema';
import { CarrierChargeUncheckedUpdateWithoutShipmentInputObjectSchema as CarrierChargeUncheckedUpdateWithoutShipmentInputObjectSchema } from './CarrierChargeUncheckedUpdateWithoutShipmentInput.schema';
import { CarrierChargeCreateWithoutShipmentInputObjectSchema as CarrierChargeCreateWithoutShipmentInputObjectSchema } from './CarrierChargeCreateWithoutShipmentInput.schema';
import { CarrierChargeUncheckedCreateWithoutShipmentInputObjectSchema as CarrierChargeUncheckedCreateWithoutShipmentInputObjectSchema } from './CarrierChargeUncheckedCreateWithoutShipmentInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => CarrierChargeWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => CarrierChargeUpdateWithoutShipmentInputObjectSchema), z.lazy(() => CarrierChargeUncheckedUpdateWithoutShipmentInputObjectSchema)]),
  create: z.union([z.lazy(() => CarrierChargeCreateWithoutShipmentInputObjectSchema), z.lazy(() => CarrierChargeUncheckedCreateWithoutShipmentInputObjectSchema)])
}).strict();
export const CarrierChargeUpsertWithWhereUniqueWithoutShipmentInputObjectSchema: z.ZodType<Prisma.CarrierChargeUpsertWithWhereUniqueWithoutShipmentInput> = makeSchema() as unknown as z.ZodType<Prisma.CarrierChargeUpsertWithWhereUniqueWithoutShipmentInput>;
export const CarrierChargeUpsertWithWhereUniqueWithoutShipmentInputObjectZodSchema = makeSchema();
