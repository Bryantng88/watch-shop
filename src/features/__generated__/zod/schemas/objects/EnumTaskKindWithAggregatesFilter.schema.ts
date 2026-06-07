import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskKindSchema } from '../enums/TaskKind.schema';
import { NestedEnumTaskKindWithAggregatesFilterObjectSchema as NestedEnumTaskKindWithAggregatesFilterObjectSchema } from './NestedEnumTaskKindWithAggregatesFilter.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumTaskKindFilterObjectSchema as NestedEnumTaskKindFilterObjectSchema } from './NestedEnumTaskKindFilter.schema'

const makeSchema = () => z.object({
  equals: TaskKindSchema.optional(),
  in: TaskKindSchema.array().optional(),
  notIn: TaskKindSchema.array().optional(),
  not: z.union([TaskKindSchema, z.lazy(() => NestedEnumTaskKindWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumTaskKindFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumTaskKindFilterObjectSchema).optional()
}).strict();
export const EnumTaskKindWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumTaskKindWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumTaskKindWithAggregatesFilter>;
export const EnumTaskKindWithAggregatesFilterObjectZodSchema = makeSchema();
