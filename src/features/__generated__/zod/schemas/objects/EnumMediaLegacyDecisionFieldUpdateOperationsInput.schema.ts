import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MediaLegacyDecisionSchema } from '../enums/MediaLegacyDecision.schema'

const makeSchema = () => z.object({
  set: MediaLegacyDecisionSchema.optional()
}).strict();
export const EnumMediaLegacyDecisionFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumMediaLegacyDecisionFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.EnumMediaLegacyDecisionFieldUpdateOperationsInput>;
export const EnumMediaLegacyDecisionFieldUpdateOperationsInputObjectZodSchema = makeSchema();
