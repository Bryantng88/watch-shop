import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MediaLegacyClassificationSchema } from '../enums/MediaLegacyClassification.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumMediaLegacyClassificationFilterObjectSchema as NestedEnumMediaLegacyClassificationFilterObjectSchema } from './NestedEnumMediaLegacyClassificationFilter.schema'

const nestedenummedialegacyclassificationwithaggregatesfilterSchema = z.object({
  equals: MediaLegacyClassificationSchema.optional(),
  in: MediaLegacyClassificationSchema.array().optional(),
  notIn: MediaLegacyClassificationSchema.array().optional(),
  not: z.union([MediaLegacyClassificationSchema, z.lazy(() => NestedEnumMediaLegacyClassificationWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumMediaLegacyClassificationFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumMediaLegacyClassificationFilterObjectSchema).optional()
}).strict();
export const NestedEnumMediaLegacyClassificationWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumMediaLegacyClassificationWithAggregatesFilter> = nestedenummedialegacyclassificationwithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumMediaLegacyClassificationWithAggregatesFilter>;
export const NestedEnumMediaLegacyClassificationWithAggregatesFilterObjectZodSchema = nestedenummedialegacyclassificationwithaggregatesfilterSchema;
