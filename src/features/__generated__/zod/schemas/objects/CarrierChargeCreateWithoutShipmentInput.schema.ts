import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CarrierChargeKindSchema } from '../enums/CarrierChargeKind.schema';
import { CarrierSettlementStatusSchema } from '../enums/CarrierSettlementStatus.schema';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema'

import { JsonValueSchema as jsonSchema } from '../../helpers/json-helpers';

const makeSchema = () => z.object({
  id: z.string().optional(),
  kind: CarrierChargeKindSchema,
  currency: z.string().max(10).optional(),
  estimatedAmount: z.number().optional().nullable(),
  chargedAmount: z.number().optional().nullable(),
  settlementStatus: CarrierSettlementStatusSchema.optional(),
  settlementRef: z.string().optional().nullable(),
  settledAt: z.coerce.date().optional().nullable(),
  metadataJson: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();
export const CarrierChargeCreateWithoutShipmentInputObjectSchema: z.ZodType<Prisma.CarrierChargeCreateWithoutShipmentInput> = makeSchema() as unknown as z.ZodType<Prisma.CarrierChargeCreateWithoutShipmentInput>;
export const CarrierChargeCreateWithoutShipmentInputObjectZodSchema = makeSchema();
