import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskPeriodSchema } from '../enums/TaskPeriod.schema'

const makeSchema = () => z.object({
  set: TaskPeriodSchema.optional()
}).strict();
export const NullableEnumTaskPeriodFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.NullableEnumTaskPeriodFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.NullableEnumTaskPeriodFieldUpdateOperationsInput>;
export const NullableEnumTaskPeriodFieldUpdateOperationsInputObjectZodSchema = makeSchema();
