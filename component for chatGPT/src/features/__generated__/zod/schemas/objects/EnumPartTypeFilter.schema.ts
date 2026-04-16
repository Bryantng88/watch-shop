import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PartTypeSchema } from '../enums/PartType.schema';
import { NestedEnumPartTypeFilterObjectSchema as NestedEnumPartTypeFilterObjectSchema } from './NestedEnumPartTypeFilter.schema'

const makeSchema = () => z.object({
  equals: PartTypeSchema.optional(),
  in: PartTypeSchema.array().optional(),
  notIn: PartTypeSchema.array().optional(),
  not: z.union([PartTypeSchema, z.lazy(() => NestedEnumPartTypeFilterObjectSchema)]).optional()
}).strict();
export const EnumPartTypeFilterObjectSchema: z.ZodType<Prisma.EnumPartTypeFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumPartTypeFilter>;
export const EnumPartTypeFilterObjectZodSchema = makeSchema();
