import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MediaPipelineKeySchema } from '../enums/MediaPipelineKey.schema';
import { NestedEnumMediaPipelineKeyNullableWithAggregatesFilterObjectSchema as NestedEnumMediaPipelineKeyNullableWithAggregatesFilterObjectSchema } from './NestedEnumMediaPipelineKeyNullableWithAggregatesFilter.schema';
import { NestedIntNullableFilterObjectSchema as NestedIntNullableFilterObjectSchema } from './NestedIntNullableFilter.schema';
import { NestedEnumMediaPipelineKeyNullableFilterObjectSchema as NestedEnumMediaPipelineKeyNullableFilterObjectSchema } from './NestedEnumMediaPipelineKeyNullableFilter.schema'

const makeSchema = () => z.object({
  equals: MediaPipelineKeySchema.optional().nullable(),
  in: MediaPipelineKeySchema.array().optional().nullable(),
  notIn: MediaPipelineKeySchema.array().optional().nullable(),
  not: z.union([MediaPipelineKeySchema, z.lazy(() => NestedEnumMediaPipelineKeyNullableWithAggregatesFilterObjectSchema)]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumMediaPipelineKeyNullableFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumMediaPipelineKeyNullableFilterObjectSchema).optional()
}).strict();
export const EnumMediaPipelineKeyNullableWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumMediaPipelineKeyNullableWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumMediaPipelineKeyNullableWithAggregatesFilter>;
export const EnumMediaPipelineKeyNullableWithAggregatesFilterObjectZodSchema = makeSchema();
