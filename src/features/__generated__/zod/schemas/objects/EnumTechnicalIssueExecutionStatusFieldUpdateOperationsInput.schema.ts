import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalIssueExecutionStatusSchema } from '../enums/TechnicalIssueExecutionStatus.schema'

const makeSchema = () => z.object({
  set: TechnicalIssueExecutionStatusSchema.optional()
}).strict();
export const EnumTechnicalIssueExecutionStatusFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumTechnicalIssueExecutionStatusFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.EnumTechnicalIssueExecutionStatusFieldUpdateOperationsInput>;
export const EnumTechnicalIssueExecutionStatusFieldUpdateOperationsInputObjectZodSchema = makeSchema();
