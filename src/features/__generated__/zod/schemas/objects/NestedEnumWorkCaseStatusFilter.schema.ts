import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkCaseStatusSchema } from '../enums/WorkCaseStatus.schema'

const nestedenumworkcasestatusfilterSchema = z.object({
  equals: WorkCaseStatusSchema.optional(),
  in: WorkCaseStatusSchema.array().optional(),
  notIn: WorkCaseStatusSchema.array().optional(),
  not: z.union([WorkCaseStatusSchema, z.lazy(() => NestedEnumWorkCaseStatusFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumWorkCaseStatusFilterObjectSchema: z.ZodType<Prisma.NestedEnumWorkCaseStatusFilter> = nestedenumworkcasestatusfilterSchema as unknown as z.ZodType<Prisma.NestedEnumWorkCaseStatusFilter>;
export const NestedEnumWorkCaseStatusFilterObjectZodSchema = nestedenumworkcasestatusfilterSchema;
