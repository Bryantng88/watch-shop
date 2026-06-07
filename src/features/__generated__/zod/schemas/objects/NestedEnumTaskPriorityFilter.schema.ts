import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskPrioritySchema } from '../enums/TaskPriority.schema'

const nestedenumtaskpriorityfilterSchema = z.object({
  equals: TaskPrioritySchema.optional(),
  in: TaskPrioritySchema.array().optional(),
  notIn: TaskPrioritySchema.array().optional(),
  not: z.union([TaskPrioritySchema, z.lazy(() => NestedEnumTaskPriorityFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumTaskPriorityFilterObjectSchema: z.ZodType<Prisma.NestedEnumTaskPriorityFilter> = nestedenumtaskpriorityfilterSchema as unknown as z.ZodType<Prisma.NestedEnumTaskPriorityFilter>;
export const NestedEnumTaskPriorityFilterObjectZodSchema = nestedenumtaskpriorityfilterSchema;
