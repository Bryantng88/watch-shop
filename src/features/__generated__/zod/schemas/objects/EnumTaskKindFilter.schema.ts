import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskKindSchema } from '../enums/TaskKind.schema';
import { NestedEnumTaskKindFilterObjectSchema as NestedEnumTaskKindFilterObjectSchema } from './NestedEnumTaskKindFilter.schema'

const makeSchema = () => z.object({
  equals: TaskKindSchema.optional(),
  in: TaskKindSchema.array().optional(),
  notIn: TaskKindSchema.array().optional(),
  not: z.union([TaskKindSchema, z.lazy(() => NestedEnumTaskKindFilterObjectSchema)]).optional()
}).strict();
export const EnumTaskKindFilterObjectSchema: z.ZodType<Prisma.EnumTaskKindFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumTaskKindFilter>;
export const EnumTaskKindFilterObjectZodSchema = makeSchema();
