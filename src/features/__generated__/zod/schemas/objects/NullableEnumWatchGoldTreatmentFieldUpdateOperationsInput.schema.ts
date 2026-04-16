import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchGoldTreatmentSchema } from '../enums/WatchGoldTreatment.schema'

const makeSchema = () => z.object({
  set: WatchGoldTreatmentSchema.optional()
}).strict();
export const NullableEnumWatchGoldTreatmentFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.NullableEnumWatchGoldTreatmentFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.NullableEnumWatchGoldTreatmentFieldUpdateOperationsInput>;
export const NullableEnumWatchGoldTreatmentFieldUpdateOperationsInputObjectZodSchema = makeSchema();
