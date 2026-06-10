import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskExecutionActionTypeSchema } from '../enums/TaskExecutionActionType.schema'

const nestedenumtaskexecutionactiontypefilterSchema = z.object({
  equals: TaskExecutionActionTypeSchema.optional(),
  in: TaskExecutionActionTypeSchema.array().optional(),
  notIn: TaskExecutionActionTypeSchema.array().optional(),
  not: z.union([TaskExecutionActionTypeSchema, z.lazy(() => NestedEnumTaskExecutionActionTypeFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumTaskExecutionActionTypeFilterObjectSchema: z.ZodType<Prisma.NestedEnumTaskExecutionActionTypeFilter> = nestedenumtaskexecutionactiontypefilterSchema as unknown as z.ZodType<Prisma.NestedEnumTaskExecutionActionTypeFilter>;
export const NestedEnumTaskExecutionActionTypeFilterObjectZodSchema = nestedenumtaskexecutionactiontypefilterSchema;
