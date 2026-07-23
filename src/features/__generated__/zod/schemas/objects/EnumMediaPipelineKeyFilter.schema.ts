import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MediaPipelineKeySchema } from '../enums/MediaPipelineKey.schema';
import { NestedEnumMediaPipelineKeyFilterObjectSchema as NestedEnumMediaPipelineKeyFilterObjectSchema } from './NestedEnumMediaPipelineKeyFilter.schema'

const makeSchema = () => z.object({
  equals: MediaPipelineKeySchema.optional(),
  in: MediaPipelineKeySchema.array().optional(),
  notIn: MediaPipelineKeySchema.array().optional(),
  not: z.union([MediaPipelineKeySchema, z.lazy(() => NestedEnumMediaPipelineKeyFilterObjectSchema)]).optional()
}).strict();
export const EnumMediaPipelineKeyFilterObjectSchema: z.ZodType<Prisma.EnumMediaPipelineKeyFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumMediaPipelineKeyFilter>;
export const EnumMediaPipelineKeyFilterObjectZodSchema = makeSchema();
