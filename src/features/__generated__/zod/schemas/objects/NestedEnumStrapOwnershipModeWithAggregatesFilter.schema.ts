import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StrapOwnershipModeSchema } from '../enums/StrapOwnershipMode.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumStrapOwnershipModeFilterObjectSchema as NestedEnumStrapOwnershipModeFilterObjectSchema } from './NestedEnumStrapOwnershipModeFilter.schema'

const nestedenumstrapownershipmodewithaggregatesfilterSchema = z.object({
  equals: StrapOwnershipModeSchema.optional(),
  in: StrapOwnershipModeSchema.array().optional(),
  notIn: StrapOwnershipModeSchema.array().optional(),
  not: z.union([StrapOwnershipModeSchema, z.lazy(() => NestedEnumStrapOwnershipModeWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumStrapOwnershipModeFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumStrapOwnershipModeFilterObjectSchema).optional()
}).strict();
export const NestedEnumStrapOwnershipModeWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumStrapOwnershipModeWithAggregatesFilter> = nestedenumstrapownershipmodewithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumStrapOwnershipModeWithAggregatesFilter>;
export const NestedEnumStrapOwnershipModeWithAggregatesFilterObjectZodSchema = nestedenumstrapownershipmodewithaggregatesfilterSchema;
