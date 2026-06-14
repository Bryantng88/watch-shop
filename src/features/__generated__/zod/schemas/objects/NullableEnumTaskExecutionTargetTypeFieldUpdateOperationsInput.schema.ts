import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskExecutionTargetTypeSchema } from '../enums/TaskExecutionTargetType.schema'

const makeSchema = () => z.object({
  set: TaskExecutionTargetTypeSchema.optional()
}).strict();
export const NullableEnumTaskExecutionTargetTypeFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.NullableEnumTaskExecutionTargetTypeFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.NullableEnumTaskExecutionTargetTypeFieldUpdateOperationsInput>;
export const NullableEnumTaskExecutionTargetTypeFieldUpdateOperationsInputObjectZodSchema = makeSchema();
