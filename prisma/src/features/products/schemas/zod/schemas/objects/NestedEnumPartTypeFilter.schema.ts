import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PartTypeSchema } from '../enums/PartType.schema'

const nestedenumparttypefilterSchema = z.object({
  equals: PartTypeSchema.optional(),
  in: PartTypeSchema.array().optional(),
  notIn: PartTypeSchema.array().optional(),
  not: z.union([PartTypeSchema, z.lazy(() => NestedEnumPartTypeFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumPartTypeFilterObjectSchema: z.ZodType<Prisma.NestedEnumPartTypeFilter> = nestedenumparttypefilterSchema as unknown as z.ZodType<Prisma.NestedEnumPartTypeFilter>;
export const NestedEnumPartTypeFilterObjectZodSchema = nestedenumparttypefilterSchema;
