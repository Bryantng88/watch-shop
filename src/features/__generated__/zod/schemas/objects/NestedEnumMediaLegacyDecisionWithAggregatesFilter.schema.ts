import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MediaLegacyDecisionSchema } from '../enums/MediaLegacyDecision.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumMediaLegacyDecisionFilterObjectSchema as NestedEnumMediaLegacyDecisionFilterObjectSchema } from './NestedEnumMediaLegacyDecisionFilter.schema'

const nestedenummedialegacydecisionwithaggregatesfilterSchema = z.object({
  equals: MediaLegacyDecisionSchema.optional(),
  in: MediaLegacyDecisionSchema.array().optional(),
  notIn: MediaLegacyDecisionSchema.array().optional(),
  not: z.union([MediaLegacyDecisionSchema, z.lazy(() => NestedEnumMediaLegacyDecisionWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumMediaLegacyDecisionFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumMediaLegacyDecisionFilterObjectSchema).optional()
}).strict();
export const NestedEnumMediaLegacyDecisionWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumMediaLegacyDecisionWithAggregatesFilter> = nestedenummedialegacydecisionwithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumMediaLegacyDecisionWithAggregatesFilter>;
export const NestedEnumMediaLegacyDecisionWithAggregatesFilterObjectZodSchema = nestedenummedialegacydecisionwithaggregatesfilterSchema;
