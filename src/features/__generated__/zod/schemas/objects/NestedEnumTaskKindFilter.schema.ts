import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskKindSchema } from '../enums/TaskKind.schema'

const nestedenumtaskkindfilterSchema = z.object({
  equals: TaskKindSchema.optional(),
  in: TaskKindSchema.array().optional(),
  notIn: TaskKindSchema.array().optional(),
  not: z.union([TaskKindSchema, z.lazy(() => NestedEnumTaskKindFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumTaskKindFilterObjectSchema: z.ZodType<Prisma.NestedEnumTaskKindFilter> = nestedenumtaskkindfilterSchema as unknown as z.ZodType<Prisma.NestedEnumTaskKindFilter>;
export const NestedEnumTaskKindFilterObjectZodSchema = nestedenumtaskkindfilterSchema;
