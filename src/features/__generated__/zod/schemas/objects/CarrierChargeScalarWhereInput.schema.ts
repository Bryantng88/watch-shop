import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { UuidFilterObjectSchema as UuidFilterObjectSchema } from './UuidFilter.schema';
import { EnumCarrierChargeKindFilterObjectSchema as EnumCarrierChargeKindFilterObjectSchema } from './EnumCarrierChargeKindFilter.schema';
import { CarrierChargeKindSchema } from '../enums/CarrierChargeKind.schema';
import { DecimalNullableFilterObjectSchema as DecimalNullableFilterObjectSchema } from './DecimalNullableFilter.schema';
import { EnumCarrierSettlementStatusFilterObjectSchema as EnumCarrierSettlementStatusFilterObjectSchema } from './EnumCarrierSettlementStatusFilter.schema';
import { CarrierSettlementStatusSchema } from '../enums/CarrierSettlementStatus.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { DateTimeNullableFilterObjectSchema as DateTimeNullableFilterObjectSchema } from './DateTimeNullableFilter.schema';
import { JsonNullableFilterObjectSchema as JsonNullableFilterObjectSchema } from './JsonNullableFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema'

const carrierchargescalarwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => CarrierChargeScalarWhereInputObjectSchema), z.lazy(() => CarrierChargeScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => CarrierChargeScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => CarrierChargeScalarWhereInputObjectSchema), z.lazy(() => CarrierChargeScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  shipmentId: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  kind: z.union([z.lazy(() => EnumCarrierChargeKindFilterObjectSchema), CarrierChargeKindSchema]).optional(),
  currency: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  estimatedAmount: z.union([z.lazy(() => DecimalNullableFilterObjectSchema), z.number()]).optional().nullable(),
  chargedAmount: z.union([z.lazy(() => DecimalNullableFilterObjectSchema), z.number()]).optional().nullable(),
  settlementStatus: z.union([z.lazy(() => EnumCarrierSettlementStatusFilterObjectSchema), CarrierSettlementStatusSchema]).optional(),
  settlementRef: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  settledAt: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  metadataJson: z.lazy(() => JsonNullableFilterObjectSchema).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const CarrierChargeScalarWhereInputObjectSchema: z.ZodType<Prisma.CarrierChargeScalarWhereInput> = carrierchargescalarwhereinputSchema as unknown as z.ZodType<Prisma.CarrierChargeScalarWhereInput>;
export const CarrierChargeScalarWhereInputObjectZodSchema = carrierchargescalarwhereinputSchema;
