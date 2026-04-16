import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CaseTypeSchema } from '../enums/CaseType.schema'

const makeSchema = () => z.object({
  set: CaseTypeSchema.optional()
}).strict();
export const NullableEnumCaseTypeFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.NullableEnumCaseTypeFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.NullableEnumCaseTypeFieldUpdateOperationsInput>;
export const NullableEnumCaseTypeFieldUpdateOperationsInputObjectZodSchema = makeSchema();
