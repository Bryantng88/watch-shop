import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MediaLegacyDecisionSchema } from '../enums/MediaLegacyDecision.schema';
import { NestedEnumMediaLegacyDecisionWithAggregatesFilterObjectSchema as NestedEnumMediaLegacyDecisionWithAggregatesFilterObjectSchema } from './NestedEnumMediaLegacyDecisionWithAggregatesFilter.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumMediaLegacyDecisionFilterObjectSchema as NestedEnumMediaLegacyDecisionFilterObjectSchema } from './NestedEnumMediaLegacyDecisionFilter.schema'

const makeSchema = () => z.object({
  equals: MediaLegacyDecisionSchema.optional(),
  in: MediaLegacyDecisionSchema.array().optional(),
  notIn: MediaLegacyDecisionSchema.array().optional(),
  not: z.union([MediaLegacyDecisionSchema, z.lazy(() => NestedEnumMediaLegacyDecisionWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumMediaLegacyDecisionFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumMediaLegacyDecisionFilterObjectSchema).optional()
}).strict();
export const EnumMediaLegacyDecisionWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumMediaLegacyDecisionWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumMediaLegacyDecisionWithAggregatesFilter>;
export const EnumMediaLegacyDecisionWithAggregatesFilterObjectZodSchema = makeSchema();
