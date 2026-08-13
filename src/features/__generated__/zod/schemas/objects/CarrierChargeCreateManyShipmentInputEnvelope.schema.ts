import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CarrierChargeCreateManyShipmentInputObjectSchema as CarrierChargeCreateManyShipmentInputObjectSchema } from './CarrierChargeCreateManyShipmentInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => CarrierChargeCreateManyShipmentInputObjectSchema), z.lazy(() => CarrierChargeCreateManyShipmentInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const CarrierChargeCreateManyShipmentInputEnvelopeObjectSchema: z.ZodType<Prisma.CarrierChargeCreateManyShipmentInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.CarrierChargeCreateManyShipmentInputEnvelope>;
export const CarrierChargeCreateManyShipmentInputEnvelopeObjectZodSchema = makeSchema();
