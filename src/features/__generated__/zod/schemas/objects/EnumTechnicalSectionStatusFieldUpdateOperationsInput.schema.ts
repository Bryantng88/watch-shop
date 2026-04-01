import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalSectionStatusSchema } from '../enums/TechnicalSectionStatus.schema'

const makeSchema = () => z.object({
  set: TechnicalSectionStatusSchema.optional()
}).strict();
export const EnumTechnicalSectionStatusFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumTechnicalSectionStatusFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.EnumTechnicalSectionStatusFieldUpdateOperationsInput>;
export const EnumTechnicalSectionStatusFieldUpdateOperationsInputObjectZodSchema = makeSchema();
