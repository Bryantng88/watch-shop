import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalIssueTypeSchema } from '../enums/TechnicalIssueType.schema'

const makeSchema = () => z.object({
  set: TechnicalIssueTypeSchema.optional()
}).strict();
export const EnumTechnicalIssueTypeFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumTechnicalIssueTypeFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.EnumTechnicalIssueTypeFieldUpdateOperationsInput>;
export const EnumTechnicalIssueTypeFieldUpdateOperationsInputObjectZodSchema = makeSchema();
