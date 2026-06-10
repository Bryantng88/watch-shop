import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskExecutionTargetTypeSchema } from '../enums/TaskExecutionTargetType.schema'

const makeSchema = () => z.object({
  set: TaskExecutionTargetTypeSchema.optional()
}).strict();
export const EnumTaskExecutionTargetTypeFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumTaskExecutionTargetTypeFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.EnumTaskExecutionTargetTypeFieldUpdateOperationsInput>;
export const EnumTaskExecutionTargetTypeFieldUpdateOperationsInputObjectZodSchema = makeSchema();
