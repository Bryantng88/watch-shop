import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  taskTypeId: z.string(),
  code: z.string()
}).strict();
export const TaskActionTaskTypeIdCodeCompoundUniqueInputObjectSchema: z.ZodType<Prisma.TaskActionTaskTypeIdCodeCompoundUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskActionTaskTypeIdCodeCompoundUniqueInput>;
export const TaskActionTaskTypeIdCodeCompoundUniqueInputObjectZodSchema = makeSchema();
