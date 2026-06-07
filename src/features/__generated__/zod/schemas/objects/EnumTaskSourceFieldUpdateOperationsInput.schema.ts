import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskSourceSchema } from '../enums/TaskSource.schema'

const makeSchema = () => z.object({
  set: TaskSourceSchema.optional()
}).strict();
export const EnumTaskSourceFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumTaskSourceFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.EnumTaskSourceFieldUpdateOperationsInput>;
export const EnumTaskSourceFieldUpdateOperationsInputObjectZodSchema = makeSchema();
