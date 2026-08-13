import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { UuidWithAggregatesFilterObjectSchema as UuidWithAggregatesFilterObjectSchema } from './UuidWithAggregatesFilter.schema';
import { EnumCarrierChargeKindWithAggregatesFilterObjectSchema as EnumCarrierChargeKindWithAggregatesFilterObjectSchema } from './EnumCarrierChargeKindWithAggregatesFilter.schema';
import { CarrierChargeKindSchema } from '../enums/CarrierChargeKind.schema';
import { DecimalNullableWithAggregatesFilterObjectSchema as DecimalNullableWithAggregatesFilterObjectSchema } from './DecimalNullableWithAggregatesFilter.schema';
import { EnumCarrierSettlementStatusWithAggregatesFilterObjectSchema as EnumCarrierSettlementStatusWithAggregatesFilterObjectSchema } from './EnumCarrierSettlementStatusWithAggregatesFilter.schema';
import { CarrierSettlementStatusSchema } from '../enums/CarrierSettlementStatus.schema';
import { StringNullableWithAggregatesFilterObjectSchema as StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema';
import { DateTimeNullableWithAggregatesFilterObjectSchema as DateTimeNullableWithAggregatesFilterObjectSchema } from './DateTimeNullableWithAggregatesFilter.schema';
import { JsonNullableWithAggregatesFilterObjectSchema as JsonNullableWithAggregatesFilterObjectSchema } from './JsonNullableWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema as DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema'

const carrierchargescalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => CarrierChargeScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => CarrierChargeScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => CarrierChargeScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => CarrierChargeScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => CarrierChargeScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  shipmentId: z.union([z.lazy(() => UuidWithAggregatesFilterObjectSchema), z.string()]).optional(),
  kind: z.union([z.lazy(() => EnumCarrierChargeKindWithAggregatesFilterObjectSchema), CarrierChargeKindSchema]).optional(),
  currency: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string().max(10)]).optional(),
  estimatedAmount: z.union([z.lazy(() => DecimalNullableWithAggregatesFilterObjectSchema), z.number()]).optional().nullable(),
  chargedAmount: z.union([z.lazy(() => DecimalNullableWithAggregatesFilterObjectSchema), z.number()]).optional().nullable(),
  settlementStatus: z.union([z.lazy(() => EnumCarrierSettlementStatusWithAggregatesFilterObjectSchema), CarrierSettlementStatusSchema]).optional(),
  settlementRef: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  settledAt: z.union([z.lazy(() => DateTimeNullableWithAggregatesFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  metadataJson: z.lazy(() => JsonNullableWithAggregatesFilterObjectSchema).optional(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const CarrierChargeScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.CarrierChargeScalarWhereWithAggregatesInput> = carrierchargescalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.CarrierChargeScalarWhereWithAggregatesInput>;
export const CarrierChargeScalarWhereWithAggregatesInputObjectZodSchema = carrierchargescalarwherewithaggregatesinputSchema;
