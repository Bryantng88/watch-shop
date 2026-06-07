import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskStatusSchema } from '../enums/TaskStatus.schema'

const nestedenumtaskstatusfilterSchema = z.object({
  equals: TaskStatusSchema.optional(),
  in: TaskStatusSchema.array().optional(),
  notIn: TaskStatusSchema.array().optional(),
  not: z.union([TaskStatusSchema, z.lazy(() => NestedEnumTaskStatusFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumTaskStatusFilterObjectSchema: z.ZodType<Prisma.NestedEnumTaskStatusFilter> = nestedenumtaskstatusfilterSchema as unknown as z.ZodType<Prisma.NestedEnumTaskStatusFilter>;
export const NestedEnumTaskStatusFilterObjectZodSchema = nestedenumtaskstatusfilterSchema;
