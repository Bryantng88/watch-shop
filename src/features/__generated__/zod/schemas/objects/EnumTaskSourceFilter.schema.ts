import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskSourceSchema } from '../enums/TaskSource.schema';
import { NestedEnumTaskSourceFilterObjectSchema as NestedEnumTaskSourceFilterObjectSchema } from './NestedEnumTaskSourceFilter.schema'

const makeSchema = () => z.object({
  equals: TaskSourceSchema.optional(),
  in: TaskSourceSchema.array().optional(),
  notIn: TaskSourceSchema.array().optional(),
  not: z.union([TaskSourceSchema, z.lazy(() => NestedEnumTaskSourceFilterObjectSchema)]).optional()
}).strict();
export const EnumTaskSourceFilterObjectSchema: z.ZodType<Prisma.EnumTaskSourceFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumTaskSourceFilter>;
export const EnumTaskSourceFilterObjectZodSchema = makeSchema();
