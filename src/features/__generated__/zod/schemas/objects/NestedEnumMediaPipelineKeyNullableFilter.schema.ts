import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MediaPipelineKeySchema } from '../enums/MediaPipelineKey.schema'

const nestedenummediapipelinekeynullablefilterSchema = z.object({
  equals: MediaPipelineKeySchema.optional().nullable(),
  in: MediaPipelineKeySchema.array().optional().nullable(),
  notIn: MediaPipelineKeySchema.array().optional().nullable(),
  not: z.union([MediaPipelineKeySchema, z.lazy(() => NestedEnumMediaPipelineKeyNullableFilterObjectSchema)]).optional().nullable()
}).strict();
export const NestedEnumMediaPipelineKeyNullableFilterObjectSchema: z.ZodType<Prisma.NestedEnumMediaPipelineKeyNullableFilter> = nestedenummediapipelinekeynullablefilterSchema as unknown as z.ZodType<Prisma.NestedEnumMediaPipelineKeyNullableFilter>;
export const NestedEnumMediaPipelineKeyNullableFilterObjectZodSchema = nestedenummediapipelinekeynullablefilterSchema;
