import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CarrierRequestCreateManyShipmentInputObjectSchema as CarrierRequestCreateManyShipmentInputObjectSchema } from './CarrierRequestCreateManyShipmentInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => CarrierRequestCreateManyShipmentInputObjectSchema), z.lazy(() => CarrierRequestCreateManyShipmentInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const CarrierRequestCreateManyShipmentInputEnvelopeObjectSchema: z.ZodType<Prisma.CarrierRequestCreateManyShipmentInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.CarrierRequestCreateManyShipmentInputEnvelope>;
export const CarrierRequestCreateManyShipmentInputEnvelopeObjectZodSchema = makeSchema();
