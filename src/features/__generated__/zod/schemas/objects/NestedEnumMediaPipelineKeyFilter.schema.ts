import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MediaPipelineKeySchema } from '../enums/MediaPipelineKey.schema'

const nestedenummediapipelinekeyfilterSchema = z.object({
  equals: MediaPipelineKeySchema.optional(),
  in: MediaPipelineKeySchema.array().optional(),
  notIn: MediaPipelineKeySchema.array().optional(),
  not: z.union([MediaPipelineKeySchema, z.lazy(() => NestedEnumMediaPipelineKeyFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumMediaPipelineKeyFilterObjectSchema: z.ZodType<Prisma.NestedEnumMediaPipelineKeyFilter> = nestedenummediapipelinekeyfilterSchema as unknown as z.ZodType<Prisma.NestedEnumMediaPipelineKeyFilter>;
export const NestedEnumMediaPipelineKeyFilterObjectZodSchema = nestedenummediapipelinekeyfilterSchema;
