import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CarrierChargeCreateWithoutShipmentInputObjectSchema as CarrierChargeCreateWithoutShipmentInputObjectSchema } from './CarrierChargeCreateWithoutShipmentInput.schema';
import { CarrierChargeUncheckedCreateWithoutShipmentInputObjectSchema as CarrierChargeUncheckedCreateWithoutShipmentInputObjectSchema } from './CarrierChargeUncheckedCreateWithoutShipmentInput.schema';
import { CarrierChargeCreateOrConnectWithoutShipmentInputObjectSchema as CarrierChargeCreateOrConnectWithoutShipmentInputObjectSchema } from './CarrierChargeCreateOrConnectWithoutShipmentInput.schema';
import { CarrierChargeCreateManyShipmentInputEnvelopeObjectSchema as CarrierChargeCreateManyShipmentInputEnvelopeObjectSchema } from './CarrierChargeCreateManyShipmentInputEnvelope.schema';
import { CarrierChargeWhereUniqueInputObjectSchema as CarrierChargeWhereUniqueInputObjectSchema } from './CarrierChargeWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => CarrierChargeCreateWithoutShipmentInputObjectSchema), z.lazy(() => CarrierChargeCreateWithoutShipmentInputObjectSchema).array(), z.lazy(() => CarrierChargeUncheckedCreateWithoutShipmentInputObjectSchema), z.lazy(() => CarrierChargeUncheckedCreateWithoutShipmentInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => CarrierChargeCreateOrConnectWithoutShipmentInputObjectSchema), z.lazy(() => CarrierChargeCreateOrConnectWithoutShipmentInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => CarrierChargeCreateManyShipmentInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => CarrierChargeWhereUniqueInputObjectSchema), z.lazy(() => CarrierChargeWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const CarrierChargeCreateNestedManyWithoutShipmentInputObjectSchema: z.ZodType<Prisma.CarrierChargeCreateNestedManyWithoutShipmentInput> = makeSchema() as unknown as z.ZodType<Prisma.CarrierChargeCreateNestedManyWithoutShipmentInput>;
export const CarrierChargeCreateNestedManyWithoutShipmentInputObjectZodSchema = makeSchema();
