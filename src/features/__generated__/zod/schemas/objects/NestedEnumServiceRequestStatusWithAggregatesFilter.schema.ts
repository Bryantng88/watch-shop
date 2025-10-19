import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceRequestStatusSchema } from '../enums/ServiceRequestStatus.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumServiceRequestStatusFilterObjectSchema as NestedEnumServiceRequestStatusFilterObjectSchema } from './NestedEnumServiceRequestStatusFilter.schema'

const nestedenumservicerequeststatuswithaggregatesfilterSchema = z.object({
  equals: ServiceRequestStatusSchema.optional(),
  in: ServiceRequestStatusSchema.array().optional(),
  notIn: ServiceRequestStatusSchema.array().optional(),
  not: z.union([ServiceRequestStatusSchema, z.lazy(() => NestedEnumServiceRequestStatusWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumServiceRequestStatusFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumServiceRequestStatusFilterObjectSchema).optional()
}).strict();
export const NestedEnumServiceRequestStatusWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumServiceRequestStatusWithAggregatesFilter> = nestedenumservicerequeststatuswithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumServiceRequestStatusWithAggregatesFilter>;
export const NestedEnumServiceRequestStatusWithAggregatesFilterObjectZodSchema = nestedenumservicerequeststatuswithaggregatesfilterSchema;
