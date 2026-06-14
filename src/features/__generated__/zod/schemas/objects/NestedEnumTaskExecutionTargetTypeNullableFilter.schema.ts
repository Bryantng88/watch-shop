import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskExecutionTargetTypeSchema } from '../enums/TaskExecutionTargetType.schema'

const nestedenumtaskexecutiontargettypenullablefilterSchema = z.object({
  equals: TaskExecutionTargetTypeSchema.optional().nullable(),
  in: TaskExecutionTargetTypeSchema.array().optional().nullable(),
  notIn: TaskExecutionTargetTypeSchema.array().optional().nullable(),
  not: z.union([TaskExecutionTargetTypeSchema, z.lazy(() => NestedEnumTaskExecutionTargetTypeNullableFilterObjectSchema)]).optional().nullable()
}).strict();
export const NestedEnumTaskExecutionTargetTypeNullableFilterObjectSchema: z.ZodType<Prisma.NestedEnumTaskExecutionTargetTypeNullableFilter> = nestedenumtaskexecutiontargettypenullablefilterSchema as unknown as z.ZodType<Prisma.NestedEnumTaskExecutionTargetTypeNullableFilter>;
export const NestedEnumTaskExecutionTargetTypeNullableFilterObjectZodSchema = nestedenumtaskexecutiontargettypenullablefilterSchema;
