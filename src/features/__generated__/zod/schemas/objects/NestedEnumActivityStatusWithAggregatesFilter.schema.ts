import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ActivityStatusSchema } from '../enums/ActivityStatus.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumActivityStatusFilterObjectSchema as NestedEnumActivityStatusFilterObjectSchema } from './NestedEnumActivityStatusFilter.schema'

const nestedenumactivitystatuswithaggregatesfilterSchema = z.object({
  equals: ActivityStatusSchema.optional(),
  in: ActivityStatusSchema.array().optional(),
  notIn: ActivityStatusSchema.array().optional(),
  not: z.union([ActivityStatusSchema, z.lazy(() => NestedEnumActivityStatusWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumActivityStatusFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumActivityStatusFilterObjectSchema).optional()
}).strict();
export const NestedEnumActivityStatusWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumActivityStatusWithAggregatesFilter> = nestedenumactivitystatuswithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumActivityStatusWithAggregatesFilter>;
export const NestedEnumActivityStatusWithAggregatesFilterObjectZodSchema = nestedenumactivitystatuswithaggregatesfilterSchema;
