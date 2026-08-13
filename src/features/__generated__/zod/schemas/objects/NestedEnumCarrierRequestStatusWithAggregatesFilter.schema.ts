import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CarrierRequestStatusSchema } from '../enums/CarrierRequestStatus.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumCarrierRequestStatusFilterObjectSchema as NestedEnumCarrierRequestStatusFilterObjectSchema } from './NestedEnumCarrierRequestStatusFilter.schema'

const nestedenumcarrierrequeststatuswithaggregatesfilterSchema = z.object({
  equals: CarrierRequestStatusSchema.optional(),
  in: CarrierRequestStatusSchema.array().optional(),
  notIn: CarrierRequestStatusSchema.array().optional(),
  not: z.union([CarrierRequestStatusSchema, z.lazy(() => NestedEnumCarrierRequestStatusWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumCarrierRequestStatusFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumCarrierRequestStatusFilterObjectSchema).optional()
}).strict();
export const NestedEnumCarrierRequestStatusWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumCarrierRequestStatusWithAggregatesFilter> = nestedenumcarrierrequeststatuswithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumCarrierRequestStatusWithAggregatesFilter>;
export const NestedEnumCarrierRequestStatusWithAggregatesFilterObjectZodSchema = nestedenumcarrierrequeststatuswithaggregatesfilterSchema;
