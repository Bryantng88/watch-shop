import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { JsonNullValueInputSchema } from '../enums/JsonNullValueInput.schema';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema';
import { CarrierRequestStatusSchema } from '../enums/CarrierRequestStatus.schema'

import { JsonValueSchema as jsonSchema } from '../../helpers/json-helpers';

const makeSchema = () => z.object({
  id: z.string().optional(),
  shipmentId: z.string(),
  carrierCode: z.string(),
  environment: z.string(),
  operation: z.string(),
  idempotencyKey: z.string(),
  requestJson: z.union([JsonNullValueInputSchema, jsonSchema]),
  responseJson: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  status: CarrierRequestStatusSchema.optional(),
  httpStatus: z.number().int().optional().nullable(),
  externalOrderCode: z.string().optional().nullable(),
  errorCode: z.string().optional().nullable(),
  errorMessage: z.string().optional().nullable(),
  attemptCount: z.number().int().optional(),
  requestedAt: z.coerce.date().optional(),
  completedAt: z.coerce.date().optional().nullable()
}).strict();
export const CarrierRequestUncheckedCreateInputObjectSchema: z.ZodType<Prisma.CarrierRequestUncheckedCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.CarrierRequestUncheckedCreateInput>;
export const CarrierRequestUncheckedCreateInputObjectZodSchema = makeSchema();
