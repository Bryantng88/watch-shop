import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MediaAssetStatusSchema } from '../enums/MediaAssetStatus.schema'

const makeSchema = () => z.object({
  set: MediaAssetStatusSchema.optional()
}).strict();
export const EnumMediaAssetStatusFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumMediaAssetStatusFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.EnumMediaAssetStatusFieldUpdateOperationsInput>;
export const EnumMediaAssetStatusFieldUpdateOperationsInputObjectZodSchema = makeSchema();
