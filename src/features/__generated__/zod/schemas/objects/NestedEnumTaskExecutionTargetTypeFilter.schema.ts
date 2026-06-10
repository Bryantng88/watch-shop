import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskExecutionTargetTypeSchema } from '../enums/TaskExecutionTargetType.schema'

const nestedenumtaskexecutiontargettypefilterSchema = z.object({
  equals: TaskExecutionTargetTypeSchema.optional(),
  in: TaskExecutionTargetTypeSchema.array().optional(),
  notIn: TaskExecutionTargetTypeSchema.array().optional(),
  not: z.union([TaskExecutionTargetTypeSchema, z.lazy(() => NestedEnumTaskExecutionTargetTypeFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumTaskExecutionTargetTypeFilterObjectSchema: z.ZodType<Prisma.NestedEnumTaskExecutionTargetTypeFilter> = nestedenumtaskexecutiontargettypefilterSchema as unknown as z.ZodType<Prisma.NestedEnumTaskExecutionTargetTypeFilter>;
export const NestedEnumTaskExecutionTargetTypeFilterObjectZodSchema = nestedenumtaskexecutiontargettypefilterSchema;
