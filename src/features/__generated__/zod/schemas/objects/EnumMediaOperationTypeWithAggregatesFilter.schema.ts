import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MediaOperationTypeSchema } from '../enums/MediaOperationType.schema';
import { NestedEnumMediaOperationTypeWithAggregatesFilterObjectSchema as NestedEnumMediaOperationTypeWithAggregatesFilterObjectSchema } from './NestedEnumMediaOperationTypeWithAggregatesFilter.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumMediaOperationTypeFilterObjectSchema as NestedEnumMediaOperationTypeFilterObjectSchema } from './NestedEnumMediaOperationTypeFilter.schema'

const makeSchema = () => z.object({
  equals: MediaOperationTypeSchema.optional(),
  in: MediaOperationTypeSchema.array().optional(),
  notIn: MediaOperationTypeSchema.array().optional(),
  not: z.union([MediaOperationTypeSchema, z.lazy(() => NestedEnumMediaOperationTypeWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumMediaOperationTypeFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumMediaOperationTypeFilterObjectSchema).optional()
}).strict();
export const EnumMediaOperationTypeWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumMediaOperationTypeWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumMediaOperationTypeWithAggregatesFilter>;
export const EnumMediaOperationTypeWithAggregatesFilterObjectZodSchema = makeSchema();
