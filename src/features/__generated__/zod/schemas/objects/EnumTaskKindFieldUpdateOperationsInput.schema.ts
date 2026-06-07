import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskKindSchema } from '../enums/TaskKind.schema'

const makeSchema = () => z.object({
  set: TaskKindSchema.optional()
}).strict();
export const EnumTaskKindFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumTaskKindFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.EnumTaskKindFieldUpdateOperationsInput>;
export const EnumTaskKindFieldUpdateOperationsInputObjectZodSchema = makeSchema();
