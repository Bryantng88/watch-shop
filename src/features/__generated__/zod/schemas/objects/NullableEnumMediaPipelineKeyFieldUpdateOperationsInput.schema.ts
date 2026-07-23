import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MediaPipelineKeySchema } from '../enums/MediaPipelineKey.schema'

const makeSchema = () => z.object({
  set: MediaPipelineKeySchema.optional()
}).strict();
export const NullableEnumMediaPipelineKeyFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.NullableEnumMediaPipelineKeyFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.NullableEnumMediaPipelineKeyFieldUpdateOperationsInput>;
export const NullableEnumMediaPipelineKeyFieldUpdateOperationsInputObjectZodSchema = makeSchema();
