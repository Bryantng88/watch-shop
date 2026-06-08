import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskCompletionModeSchema } from '../enums/TaskCompletionMode.schema';
import { NestedEnumTaskCompletionModeFilterObjectSchema as NestedEnumTaskCompletionModeFilterObjectSchema } from './NestedEnumTaskCompletionModeFilter.schema'

const makeSchema = () => z.object({
  equals: TaskCompletionModeSchema.optional(),
  in: TaskCompletionModeSchema.array().optional(),
  notIn: TaskCompletionModeSchema.array().optional(),
  not: z.union([TaskCompletionModeSchema, z.lazy(() => NestedEnumTaskCompletionModeFilterObjectSchema)]).optional()
}).strict();
export const EnumTaskCompletionModeFilterObjectSchema: z.ZodType<Prisma.EnumTaskCompletionModeFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumTaskCompletionModeFilter>;
export const EnumTaskCompletionModeFilterObjectZodSchema = makeSchema();
