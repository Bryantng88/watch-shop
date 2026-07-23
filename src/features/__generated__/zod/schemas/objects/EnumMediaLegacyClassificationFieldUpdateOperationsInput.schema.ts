import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MediaLegacyClassificationSchema } from '../enums/MediaLegacyClassification.schema'

const makeSchema = () => z.object({
  set: MediaLegacyClassificationSchema.optional()
}).strict();
export const EnumMediaLegacyClassificationFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumMediaLegacyClassificationFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.EnumMediaLegacyClassificationFieldUpdateOperationsInput>;
export const EnumMediaLegacyClassificationFieldUpdateOperationsInputObjectZodSchema = makeSchema();
