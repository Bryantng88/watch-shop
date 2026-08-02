import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StrapOriginTypeSchema } from '../enums/StrapOriginType.schema';
import { NestedEnumStrapOriginTypeFilterObjectSchema as NestedEnumStrapOriginTypeFilterObjectSchema } from './NestedEnumStrapOriginTypeFilter.schema'

const makeSchema = () => z.object({
  equals: StrapOriginTypeSchema.optional(),
  in: StrapOriginTypeSchema.array().optional(),
  notIn: StrapOriginTypeSchema.array().optional(),
  not: z.union([StrapOriginTypeSchema, z.lazy(() => NestedEnumStrapOriginTypeFilterObjectSchema)]).optional()
}).strict();
export const EnumStrapOriginTypeFilterObjectSchema: z.ZodType<Prisma.EnumStrapOriginTypeFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumStrapOriginTypeFilter>;
export const EnumStrapOriginTypeFilterObjectZodSchema = makeSchema();
