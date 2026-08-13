import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CarrierStatusHistoryCreateManyShipmentInputObjectSchema as CarrierStatusHistoryCreateManyShipmentInputObjectSchema } from './CarrierStatusHistoryCreateManyShipmentInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => CarrierStatusHistoryCreateManyShipmentInputObjectSchema), z.lazy(() => CarrierStatusHistoryCreateManyShipmentInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const CarrierStatusHistoryCreateManyShipmentInputEnvelopeObjectSchema: z.ZodType<Prisma.CarrierStatusHistoryCreateManyShipmentInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.CarrierStatusHistoryCreateManyShipmentInputEnvelope>;
export const CarrierStatusHistoryCreateManyShipmentInputEnvelopeObjectZodSchema = makeSchema();
