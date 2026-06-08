import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskDomainSchema } from '../enums/TaskDomain.schema'

const makeSchema = () => z.object({
  set: TaskDomainSchema.optional()
}).strict();
export const EnumTaskDomainFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumTaskDomainFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.EnumTaskDomainFieldUpdateOperationsInput>;
export const EnumTaskDomainFieldUpdateOperationsInputObjectZodSchema = makeSchema();
