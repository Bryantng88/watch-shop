import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceRequestStatusSchema } from '../enums/ServiceRequestStatus.schema';
import { NestedEnumServiceRequestStatusWithAggregatesFilterObjectSchema as NestedEnumServiceRequestStatusWithAggregatesFilterObjectSchema } from './NestedEnumServiceRequestStatusWithAggregatesFilter.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumServiceRequestStatusFilterObjectSchema as NestedEnumServiceRequestStatusFilterObjectSchema } from './NestedEnumServiceRequestStatusFilter.schema'

const makeSchema = () => z.object({
  equals: ServiceRequestStatusSchema.optional(),
  in: ServiceRequestStatusSchema.array().optional(),
  notIn: ServiceRequestStatusSchema.array().optional(),
  not: z.union([ServiceRequestStatusSchema, z.lazy(() => NestedEnumServiceRequestStatusWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumServiceRequestStatusFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumServiceRequestStatusFilterObjectSchema).optional()
}).strict();
export const EnumServiceRequestStatusWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumServiceRequestStatusWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumServiceRequestStatusWithAggregatesFilter>;
export const EnumServiceRequestStatusWithAggregatesFilterObjectZodSchema = makeSchema();
