import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskSourceSchema } from '../enums/TaskSource.schema'

const nestedenumtasksourcefilterSchema = z.object({
  equals: TaskSourceSchema.optional(),
  in: TaskSourceSchema.array().optional(),
  notIn: TaskSourceSchema.array().optional(),
  not: z.union([TaskSourceSchema, z.lazy(() => NestedEnumTaskSourceFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumTaskSourceFilterObjectSchema: z.ZodType<Prisma.NestedEnumTaskSourceFilter> = nestedenumtasksourcefilterSchema as unknown as z.ZodType<Prisma.NestedEnumTaskSourceFilter>;
export const NestedEnumTaskSourceFilterObjectZodSchema = nestedenumtasksourcefilterSchema;
