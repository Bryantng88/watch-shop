import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StrapSchema } from '../enums/Strap.schema';
import { NestedEnumStrapWithAggregatesFilterObjectSchema as NestedEnumStrapWithAggregatesFilterObjectSchema } from './NestedEnumStrapWithAggregatesFilter.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumStrapFilterObjectSchema as NestedEnumStrapFilterObjectSchema } from './NestedEnumStrapFilter.schema'

const makeSchema = () => z.object({
  equals: StrapSchema.optional(),
  in: StrapSchema.array().optional(),
  notIn: StrapSchema.array().optional(),
  not: z.union([StrapSchema, z.lazy(() => NestedEnumStrapWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumStrapFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumStrapFilterObjectSchema).optional()
}).strict();
export const EnumStrapWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumStrapWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumStrapWithAggregatesFilter>;
export const EnumStrapWithAggregatesFilterObjectZodSchema = makeSchema();
