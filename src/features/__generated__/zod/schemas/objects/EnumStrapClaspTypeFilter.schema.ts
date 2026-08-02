import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StrapClaspTypeSchema } from '../enums/StrapClaspType.schema';
import { NestedEnumStrapClaspTypeFilterObjectSchema as NestedEnumStrapClaspTypeFilterObjectSchema } from './NestedEnumStrapClaspTypeFilter.schema'

const makeSchema = () => z.object({
  equals: StrapClaspTypeSchema.optional(),
  in: StrapClaspTypeSchema.array().optional(),
  notIn: StrapClaspTypeSchema.array().optional(),
  not: z.union([StrapClaspTypeSchema, z.lazy(() => NestedEnumStrapClaspTypeFilterObjectSchema)]).optional()
}).strict();
export const EnumStrapClaspTypeFilterObjectSchema: z.ZodType<Prisma.EnumStrapClaspTypeFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumStrapClaspTypeFilter>;
export const EnumStrapClaspTypeFilterObjectZodSchema = makeSchema();
