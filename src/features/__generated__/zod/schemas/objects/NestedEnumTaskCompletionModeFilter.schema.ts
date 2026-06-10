import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskCompletionModeSchema } from '../enums/TaskCompletionMode.schema'

const nestedenumtaskcompletionmodefilterSchema = z.object({
  equals: TaskCompletionModeSchema.optional(),
  in: TaskCompletionModeSchema.array().optional(),
  notIn: TaskCompletionModeSchema.array().optional(),
  not: z.union([TaskCompletionModeSchema, z.lazy(() => NestedEnumTaskCompletionModeFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumTaskCompletionModeFilterObjectSchema: z.ZodType<Prisma.NestedEnumTaskCompletionModeFilter> = nestedenumtaskcompletionmodefilterSchema as unknown as z.ZodType<Prisma.NestedEnumTaskCompletionModeFilter>;
export const NestedEnumTaskCompletionModeFilterObjectZodSchema = nestedenumtaskcompletionmodefilterSchema;
