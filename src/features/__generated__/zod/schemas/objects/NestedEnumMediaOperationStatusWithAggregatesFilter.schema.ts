import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MediaOperationStatusSchema } from '../enums/MediaOperationStatus.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumMediaOperationStatusFilterObjectSchema as NestedEnumMediaOperationStatusFilterObjectSchema } from './NestedEnumMediaOperationStatusFilter.schema'

const nestedenummediaoperationstatuswithaggregatesfilterSchema = z.object({
  equals: MediaOperationStatusSchema.optional(),
  in: MediaOperationStatusSchema.array().optional(),
  notIn: MediaOperationStatusSchema.array().optional(),
  not: z.union([MediaOperationStatusSchema, z.lazy(() => NestedEnumMediaOperationStatusWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumMediaOperationStatusFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumMediaOperationStatusFilterObjectSchema).optional()
}).strict();
export const NestedEnumMediaOperationStatusWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumMediaOperationStatusWithAggregatesFilter> = nestedenummediaoperationstatuswithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumMediaOperationStatusWithAggregatesFilter>;
export const NestedEnumMediaOperationStatusWithAggregatesFilterObjectZodSchema = nestedenummediaoperationstatuswithaggregatesfilterSchema;
