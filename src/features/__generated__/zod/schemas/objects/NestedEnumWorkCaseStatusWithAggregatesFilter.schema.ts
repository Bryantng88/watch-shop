import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkCaseStatusSchema } from '../enums/WorkCaseStatus.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumWorkCaseStatusFilterObjectSchema as NestedEnumWorkCaseStatusFilterObjectSchema } from './NestedEnumWorkCaseStatusFilter.schema'

const nestedenumworkcasestatuswithaggregatesfilterSchema = z.object({
  equals: WorkCaseStatusSchema.optional(),
  in: WorkCaseStatusSchema.array().optional(),
  notIn: WorkCaseStatusSchema.array().optional(),
  not: z.union([WorkCaseStatusSchema, z.lazy(() => NestedEnumWorkCaseStatusWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumWorkCaseStatusFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumWorkCaseStatusFilterObjectSchema).optional()
}).strict();
export const NestedEnumWorkCaseStatusWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumWorkCaseStatusWithAggregatesFilter> = nestedenumworkcasestatuswithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumWorkCaseStatusWithAggregatesFilter>;
export const NestedEnumWorkCaseStatusWithAggregatesFilterObjectZodSchema = nestedenumworkcasestatuswithaggregatesfilterSchema;
