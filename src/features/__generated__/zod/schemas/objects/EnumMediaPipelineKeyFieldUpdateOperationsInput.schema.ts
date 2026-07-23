import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MediaPipelineKeySchema } from '../enums/MediaPipelineKey.schema'

const makeSchema = () => z.object({
  set: MediaPipelineKeySchema.optional()
}).strict();
export const EnumMediaPipelineKeyFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumMediaPipelineKeyFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.EnumMediaPipelineKeyFieldUpdateOperationsInput>;
export const EnumMediaPipelineKeyFieldUpdateOperationsInputObjectZodSchema = makeSchema();
