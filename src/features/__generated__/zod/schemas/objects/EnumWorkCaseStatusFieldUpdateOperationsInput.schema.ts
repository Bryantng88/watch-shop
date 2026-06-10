import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkCaseStatusSchema } from '../enums/WorkCaseStatus.schema'

const makeSchema = () => z.object({
  set: WorkCaseStatusSchema.optional()
}).strict();
export const EnumWorkCaseStatusFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumWorkCaseStatusFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.EnumWorkCaseStatusFieldUpdateOperationsInput>;
export const EnumWorkCaseStatusFieldUpdateOperationsInputObjectZodSchema = makeSchema();
