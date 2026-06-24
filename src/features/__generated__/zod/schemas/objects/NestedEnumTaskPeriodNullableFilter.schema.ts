import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskPeriodSchema } from '../enums/TaskPeriod.schema'

const nestedenumtaskperiodnullablefilterSchema = z.object({
  equals: TaskPeriodSchema.optional().nullable(),
  in: TaskPeriodSchema.array().optional().nullable(),
  notIn: TaskPeriodSchema.array().optional().nullable(),
  not: z.union([TaskPeriodSchema, z.lazy(() => NestedEnumTaskPeriodNullableFilterObjectSchema)]).optional().nullable()
}).strict();
export const NestedEnumTaskPeriodNullableFilterObjectSchema: z.ZodType<Prisma.NestedEnumTaskPeriodNullableFilter> = nestedenumtaskperiodnullablefilterSchema as unknown as z.ZodType<Prisma.NestedEnumTaskPeriodNullableFilter>;
export const NestedEnumTaskPeriodNullableFilterObjectZodSchema = nestedenumtaskperiodnullablefilterSchema;
