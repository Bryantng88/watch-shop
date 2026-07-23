import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MediaPipelineKeySchema } from '../enums/MediaPipelineKey.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumMediaPipelineKeyFilterObjectSchema as NestedEnumMediaPipelineKeyFilterObjectSchema } from './NestedEnumMediaPipelineKeyFilter.schema'

const nestedenummediapipelinekeywithaggregatesfilterSchema = z.object({
  equals: MediaPipelineKeySchema.optional(),
  in: MediaPipelineKeySchema.array().optional(),
  notIn: MediaPipelineKeySchema.array().optional(),
  not: z.union([MediaPipelineKeySchema, z.lazy(() => NestedEnumMediaPipelineKeyWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumMediaPipelineKeyFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumMediaPipelineKeyFilterObjectSchema).optional()
}).strict();
export const NestedEnumMediaPipelineKeyWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumMediaPipelineKeyWithAggregatesFilter> = nestedenummediapipelinekeywithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumMediaPipelineKeyWithAggregatesFilter>;
export const NestedEnumMediaPipelineKeyWithAggregatesFilterObjectZodSchema = nestedenummediapipelinekeywithaggregatesfilterSchema;
