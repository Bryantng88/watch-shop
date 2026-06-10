import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskExecutionActionTypeSchema } from '../enums/TaskExecutionActionType.schema';
import { NestedEnumTaskExecutionActionTypeFilterObjectSchema as NestedEnumTaskExecutionActionTypeFilterObjectSchema } from './NestedEnumTaskExecutionActionTypeFilter.schema'

const makeSchema = () => z.object({
  equals: TaskExecutionActionTypeSchema.optional(),
  in: TaskExecutionActionTypeSchema.array().optional(),
  notIn: TaskExecutionActionTypeSchema.array().optional(),
  not: z.union([TaskExecutionActionTypeSchema, z.lazy(() => NestedEnumTaskExecutionActionTypeFilterObjectSchema)]).optional()
}).strict();
export const EnumTaskExecutionActionTypeFilterObjectSchema: z.ZodType<Prisma.EnumTaskExecutionActionTypeFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumTaskExecutionActionTypeFilter>;
export const EnumTaskExecutionActionTypeFilterObjectZodSchema = makeSchema();
