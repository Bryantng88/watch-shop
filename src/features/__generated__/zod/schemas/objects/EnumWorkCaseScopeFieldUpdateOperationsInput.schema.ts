import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkCaseScopeSchema } from '../enums/WorkCaseScope.schema'

const makeSchema = () => z.object({
  set: WorkCaseScopeSchema.optional()
}).strict();
export const EnumWorkCaseScopeFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumWorkCaseScopeFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.EnumWorkCaseScopeFieldUpdateOperationsInput>;
export const EnumWorkCaseScopeFieldUpdateOperationsInputObjectZodSchema = makeSchema();
