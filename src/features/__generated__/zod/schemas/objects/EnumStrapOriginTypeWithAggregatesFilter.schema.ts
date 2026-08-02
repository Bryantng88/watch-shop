import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StrapOriginTypeSchema } from '../enums/StrapOriginType.schema';
import { NestedEnumStrapOriginTypeWithAggregatesFilterObjectSchema as NestedEnumStrapOriginTypeWithAggregatesFilterObjectSchema } from './NestedEnumStrapOriginTypeWithAggregatesFilter.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumStrapOriginTypeFilterObjectSchema as NestedEnumStrapOriginTypeFilterObjectSchema } from './NestedEnumStrapOriginTypeFilter.schema'

const makeSchema = () => z.object({
  equals: StrapOriginTypeSchema.optional(),
  in: StrapOriginTypeSchema.array().optional(),
  notIn: StrapOriginTypeSchema.array().optional(),
  not: z.union([StrapOriginTypeSchema, z.lazy(() => NestedEnumStrapOriginTypeWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumStrapOriginTypeFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumStrapOriginTypeFilterObjectSchema).optional()
}).strict();
export const EnumStrapOriginTypeWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumStrapOriginTypeWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumStrapOriginTypeWithAggregatesFilter>;
export const EnumStrapOriginTypeWithAggregatesFilterObjectZodSchema = makeSchema();
