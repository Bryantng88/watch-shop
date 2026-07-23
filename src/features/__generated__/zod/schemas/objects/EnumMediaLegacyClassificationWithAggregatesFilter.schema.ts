import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MediaLegacyClassificationSchema } from '../enums/MediaLegacyClassification.schema';
import { NestedEnumMediaLegacyClassificationWithAggregatesFilterObjectSchema as NestedEnumMediaLegacyClassificationWithAggregatesFilterObjectSchema } from './NestedEnumMediaLegacyClassificationWithAggregatesFilter.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumMediaLegacyClassificationFilterObjectSchema as NestedEnumMediaLegacyClassificationFilterObjectSchema } from './NestedEnumMediaLegacyClassificationFilter.schema'

const makeSchema = () => z.object({
  equals: MediaLegacyClassificationSchema.optional(),
  in: MediaLegacyClassificationSchema.array().optional(),
  notIn: MediaLegacyClassificationSchema.array().optional(),
  not: z.union([MediaLegacyClassificationSchema, z.lazy(() => NestedEnumMediaLegacyClassificationWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumMediaLegacyClassificationFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumMediaLegacyClassificationFilterObjectSchema).optional()
}).strict();
export const EnumMediaLegacyClassificationWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumMediaLegacyClassificationWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumMediaLegacyClassificationWithAggregatesFilter>;
export const EnumMediaLegacyClassificationWithAggregatesFilterObjectZodSchema = makeSchema();
