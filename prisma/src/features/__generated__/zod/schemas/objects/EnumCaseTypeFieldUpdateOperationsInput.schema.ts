import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CaseTypeSchema } from '../enums/CaseType.schema'

const makeSchema = () => z.object({
  set: CaseTypeSchema.optional()
}).strict();
export const EnumCaseTypeFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumCaseTypeFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.EnumCaseTypeFieldUpdateOperationsInput>;
export const EnumCaseTypeFieldUpdateOperationsInputObjectZodSchema = makeSchema();
