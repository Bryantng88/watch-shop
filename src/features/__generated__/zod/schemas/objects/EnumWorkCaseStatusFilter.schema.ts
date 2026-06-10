import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkCaseStatusSchema } from '../enums/WorkCaseStatus.schema';
import { NestedEnumWorkCaseStatusFilterObjectSchema as NestedEnumWorkCaseStatusFilterObjectSchema } from './NestedEnumWorkCaseStatusFilter.schema'

const makeSchema = () => z.object({
  equals: WorkCaseStatusSchema.optional(),
  in: WorkCaseStatusSchema.array().optional(),
  notIn: WorkCaseStatusSchema.array().optional(),
  not: z.union([WorkCaseStatusSchema, z.lazy(() => NestedEnumWorkCaseStatusFilterObjectSchema)]).optional()
}).strict();
export const EnumWorkCaseStatusFilterObjectSchema: z.ZodType<Prisma.EnumWorkCaseStatusFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumWorkCaseStatusFilter>;
export const EnumWorkCaseStatusFilterObjectZodSchema = makeSchema();
