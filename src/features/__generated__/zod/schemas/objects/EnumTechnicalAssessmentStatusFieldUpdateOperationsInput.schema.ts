import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalAssessmentStatusSchema } from '../enums/TechnicalAssessmentStatus.schema'

const makeSchema = () => z.object({
  set: TechnicalAssessmentStatusSchema.optional()
}).strict();
export const EnumTechnicalAssessmentStatusFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumTechnicalAssessmentStatusFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.EnumTechnicalAssessmentStatusFieldUpdateOperationsInput>;
export const EnumTechnicalAssessmentStatusFieldUpdateOperationsInputObjectZodSchema = makeSchema();
