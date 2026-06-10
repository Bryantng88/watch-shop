import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskExecutionTargetTypeSchema } from '../enums/TaskExecutionTargetType.schema';
import { NestedEnumTaskExecutionTargetTypeFilterObjectSchema as NestedEnumTaskExecutionTargetTypeFilterObjectSchema } from './NestedEnumTaskExecutionTargetTypeFilter.schema'

const makeSchema = () => z.object({
  equals: TaskExecutionTargetTypeSchema.optional(),
  in: TaskExecutionTargetTypeSchema.array().optional(),
  notIn: TaskExecutionTargetTypeSchema.array().optional(),
  not: z.union([TaskExecutionTargetTypeSchema, z.lazy(() => NestedEnumTaskExecutionTargetTypeFilterObjectSchema)]).optional()
}).strict();
export const EnumTaskExecutionTargetTypeFilterObjectSchema: z.ZodType<Prisma.EnumTaskExecutionTargetTypeFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumTaskExecutionTargetTypeFilter>;
export const EnumTaskExecutionTargetTypeFilterObjectZodSchema = makeSchema();
