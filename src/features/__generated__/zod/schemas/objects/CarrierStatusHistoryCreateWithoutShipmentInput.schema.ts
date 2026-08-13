import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema'

import { JsonValueSchema as jsonSchema } from '../../helpers/json-helpers';

const makeSchema = () => z.object({
  id: z.string().optional(),
  carrierCode: z.string(),
  externalStatus: z.string(),
  normalizedStatus: z.string(),
  description: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  occurredAt: z.coerce.date(),
  payloadJson: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  createdAt: z.coerce.date().optional()
}).strict();
export const CarrierStatusHistoryCreateWithoutShipmentInputObjectSchema: z.ZodType<Prisma.CarrierStatusHistoryCreateWithoutShipmentInput> = makeSchema() as unknown as z.ZodType<Prisma.CarrierStatusHistoryCreateWithoutShipmentInput>;
export const CarrierStatusHistoryCreateWithoutShipmentInputObjectZodSchema = makeSchema();
