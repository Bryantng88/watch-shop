import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalActionModeSchema } from '../enums/TechnicalActionMode.schema'

const makeSchema = () => z.object({
  set: TechnicalActionModeSchema.optional()
}).strict();
export const NullableEnumTechnicalActionModeFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.NullableEnumTechnicalActionModeFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.NullableEnumTechnicalActionModeFieldUpdateOperationsInput>;
export const NullableEnumTechnicalActionModeFieldUpdateOperationsInputObjectZodSchema = makeSchema();
