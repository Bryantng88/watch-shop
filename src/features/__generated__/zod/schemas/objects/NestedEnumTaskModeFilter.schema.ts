import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskModeSchema } from '../enums/TaskMode.schema'

const nestedenumtaskmodefilterSchema = z.object({
  equals: TaskModeSchema.optional(),
  in: TaskModeSchema.array().optional(),
  notIn: TaskModeSchema.array().optional(),
  not: z.union([TaskModeSchema, z.lazy(() => NestedEnumTaskModeFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumTaskModeFilterObjectSchema: z.ZodType<Prisma.NestedEnumTaskModeFilter> = nestedenumtaskmodefilterSchema as unknown as z.ZodType<Prisma.NestedEnumTaskModeFilter>;
export const NestedEnumTaskModeFilterObjectZodSchema = nestedenumtaskmodefilterSchema;
