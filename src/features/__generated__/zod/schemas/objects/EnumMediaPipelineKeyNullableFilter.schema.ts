import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MediaPipelineKeySchema } from '../enums/MediaPipelineKey.schema';
import { NestedEnumMediaPipelineKeyNullableFilterObjectSchema as NestedEnumMediaPipelineKeyNullableFilterObjectSchema } from './NestedEnumMediaPipelineKeyNullableFilter.schema'

const makeSchema = () => z.object({
  equals: MediaPipelineKeySchema.optional().nullable(),
  in: MediaPipelineKeySchema.array().optional().nullable(),
  notIn: MediaPipelineKeySchema.array().optional().nullable(),
  not: z.union([MediaPipelineKeySchema, z.lazy(() => NestedEnumMediaPipelineKeyNullableFilterObjectSchema)]).optional().nullable()
}).strict();
export const EnumMediaPipelineKeyNullableFilterObjectSchema: z.ZodType<Prisma.EnumMediaPipelineKeyNullableFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumMediaPipelineKeyNullableFilter>;
export const EnumMediaPipelineKeyNullableFilterObjectZodSchema = makeSchema();
