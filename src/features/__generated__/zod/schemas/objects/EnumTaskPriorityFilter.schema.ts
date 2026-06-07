import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskPrioritySchema } from '../enums/TaskPriority.schema';
import { NestedEnumTaskPriorityFilterObjectSchema as NestedEnumTaskPriorityFilterObjectSchema } from './NestedEnumTaskPriorityFilter.schema'

const makeSchema = () => z.object({
  equals: TaskPrioritySchema.optional(),
  in: TaskPrioritySchema.array().optional(),
  notIn: TaskPrioritySchema.array().optional(),
  not: z.union([TaskPrioritySchema, z.lazy(() => NestedEnumTaskPriorityFilterObjectSchema)]).optional()
}).strict();
export const EnumTaskPriorityFilterObjectSchema: z.ZodType<Prisma.EnumTaskPriorityFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumTaskPriorityFilter>;
export const EnumTaskPriorityFilterObjectZodSchema = makeSchema();
