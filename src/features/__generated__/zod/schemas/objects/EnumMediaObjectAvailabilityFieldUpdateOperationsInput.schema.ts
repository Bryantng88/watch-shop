import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MediaObjectAvailabilitySchema } from '../enums/MediaObjectAvailability.schema'

const makeSchema = () => z.object({
  set: MediaObjectAvailabilitySchema.optional()
}).strict();
export const EnumMediaObjectAvailabilityFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumMediaObjectAvailabilityFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.EnumMediaObjectAvailabilityFieldUpdateOperationsInput>;
export const EnumMediaObjectAvailabilityFieldUpdateOperationsInputObjectZodSchema = makeSchema();
