import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskStatusSchema } from '../enums/TaskStatus.schema';
import { NestedEnumTaskStatusFilterObjectSchema as NestedEnumTaskStatusFilterObjectSchema } from './NestedEnumTaskStatusFilter.schema'

const makeSchema = () => z.object({
  equals: TaskStatusSchema.optional(),
  in: TaskStatusSchema.array().optional(),
  notIn: TaskStatusSchema.array().optional(),
  not: z.union([TaskStatusSchema, z.lazy(() => NestedEnumTaskStatusFilterObjectSchema)]).optional()
}).strict();
export const EnumTaskStatusFilterObjectSchema: z.ZodType<Prisma.EnumTaskStatusFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumTaskStatusFilter>;
export const EnumTaskStatusFilterObjectZodSchema = makeSchema();
