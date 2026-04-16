import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalActionModeSchema } from '../enums/TechnicalActionMode.schema'

const makeSchema = () => z.object({
  set: TechnicalActionModeSchema.optional()
}).strict();
export const EnumTechnicalActionModeFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumTechnicalActionModeFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.EnumTechnicalActionModeFieldUpdateOperationsInput>;
export const EnumTechnicalActionModeFieldUpdateOperationsInputObjectZodSchema = makeSchema();
