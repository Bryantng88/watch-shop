import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskModeSchema } from '../enums/TaskMode.schema';
import { NestedEnumTaskModeFilterObjectSchema as NestedEnumTaskModeFilterObjectSchema } from './NestedEnumTaskModeFilter.schema'

const makeSchema = () => z.object({
  equals: TaskModeSchema.optional(),
  in: TaskModeSchema.array().optional(),
  notIn: TaskModeSchema.array().optional(),
  not: z.union([TaskModeSchema, z.lazy(() => NestedEnumTaskModeFilterObjectSchema)]).optional()
}).strict();
export const EnumTaskModeFilterObjectSchema: z.ZodType<Prisma.EnumTaskModeFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumTaskModeFilter>;
export const EnumTaskModeFilterObjectZodSchema = makeSchema();
