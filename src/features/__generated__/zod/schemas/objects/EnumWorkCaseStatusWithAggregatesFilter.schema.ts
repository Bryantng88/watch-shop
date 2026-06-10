import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkCaseStatusSchema } from '../enums/WorkCaseStatus.schema';
import { NestedEnumWorkCaseStatusWithAggregatesFilterObjectSchema as NestedEnumWorkCaseStatusWithAggregatesFilterObjectSchema } from './NestedEnumWorkCaseStatusWithAggregatesFilter.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumWorkCaseStatusFilterObjectSchema as NestedEnumWorkCaseStatusFilterObjectSchema } from './NestedEnumWorkCaseStatusFilter.schema'

const makeSchema = () => z.object({
  equals: WorkCaseStatusSchema.optional(),
  in: WorkCaseStatusSchema.array().optional(),
  notIn: WorkCaseStatusSchema.array().optional(),
  not: z.union([WorkCaseStatusSchema, z.lazy(() => NestedEnumWorkCaseStatusWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumWorkCaseStatusFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumWorkCaseStatusFilterObjectSchema).optional()
}).strict();
export const EnumWorkCaseStatusWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumWorkCaseStatusWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumWorkCaseStatusWithAggregatesFilter>;
export const EnumWorkCaseStatusWithAggregatesFilterObjectZodSchema = makeSchema();
