import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CarrierChargeWhereUniqueInputObjectSchema as CarrierChargeWhereUniqueInputObjectSchema } from './CarrierChargeWhereUniqueInput.schema';
import { CarrierChargeCreateWithoutShipmentInputObjectSchema as CarrierChargeCreateWithoutShipmentInputObjectSchema } from './CarrierChargeCreateWithoutShipmentInput.schema';
import { CarrierChargeUncheckedCreateWithoutShipmentInputObjectSchema as CarrierChargeUncheckedCreateWithoutShipmentInputObjectSchema } from './CarrierChargeUncheckedCreateWithoutShipmentInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => CarrierChargeWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => CarrierChargeCreateWithoutShipmentInputObjectSchema), z.lazy(() => CarrierChargeUncheckedCreateWithoutShipmentInputObjectSchema)])
}).strict();
export const CarrierChargeCreateOrConnectWithoutShipmentInputObjectSchema: z.ZodType<Prisma.CarrierChargeCreateOrConnectWithoutShipmentInput> = makeSchema() as unknown as z.ZodType<Prisma.CarrierChargeCreateOrConnectWithoutShipmentInput>;
export const CarrierChargeCreateOrConnectWithoutShipmentInputObjectZodSchema = makeSchema();
