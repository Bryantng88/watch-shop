import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MediaOperationStatusSchema } from '../enums/MediaOperationStatus.schema';
import { NestedEnumMediaOperationStatusWithAggregatesFilterObjectSchema as NestedEnumMediaOperationStatusWithAggregatesFilterObjectSchema } from './NestedEnumMediaOperationStatusWithAggregatesFilter.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumMediaOperationStatusFilterObjectSchema as NestedEnumMediaOperationStatusFilterObjectSchema } from './NestedEnumMediaOperationStatusFilter.schema'

const makeSchema = () => z.object({
  equals: MediaOperationStatusSchema.optional(),
  in: MediaOperationStatusSchema.array().optional(),
  notIn: MediaOperationStatusSchema.array().optional(),
  not: z.union([MediaOperationStatusSchema, z.lazy(() => NestedEnumMediaOperationStatusWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumMediaOperationStatusFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumMediaOperationStatusFilterObjectSchema).optional()
}).strict();
export const EnumMediaOperationStatusWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumMediaOperationStatusWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumMediaOperationStatusWithAggregatesFilter>;
export const EnumMediaOperationStatusWithAggregatesFilterObjectZodSchema = makeSchema();
