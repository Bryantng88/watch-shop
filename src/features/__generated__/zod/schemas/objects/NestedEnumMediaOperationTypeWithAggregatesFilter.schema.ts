import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MediaOperationTypeSchema } from '../enums/MediaOperationType.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumMediaOperationTypeFilterObjectSchema as NestedEnumMediaOperationTypeFilterObjectSchema } from './NestedEnumMediaOperationTypeFilter.schema'

const nestedenummediaoperationtypewithaggregatesfilterSchema = z.object({
  equals: MediaOperationTypeSchema.optional(),
  in: MediaOperationTypeSchema.array().optional(),
  notIn: MediaOperationTypeSchema.array().optional(),
  not: z.union([MediaOperationTypeSchema, z.lazy(() => NestedEnumMediaOperationTypeWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumMediaOperationTypeFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumMediaOperationTypeFilterObjectSchema).optional()
}).strict();
export const NestedEnumMediaOperationTypeWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumMediaOperationTypeWithAggregatesFilter> = nestedenummediaoperationtypewithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumMediaOperationTypeWithAggregatesFilter>;
export const NestedEnumMediaOperationTypeWithAggregatesFilterObjectZodSchema = nestedenummediaoperationtypewithaggregatesfilterSchema;
