import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskActionTaskTypeIdCodeCompoundUniqueInputObjectSchema as TaskActionTaskTypeIdCodeCompoundUniqueInputObjectSchema } from './TaskActionTaskTypeIdCodeCompoundUniqueInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  taskTypeId_code: z.lazy(() => TaskActionTaskTypeIdCodeCompoundUniqueInputObjectSchema).optional()
}).strict();
export const TaskActionWhereUniqueInputObjectSchema: z.ZodType<Prisma.TaskActionWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskActionWhereUniqueInput>;
export const TaskActionWhereUniqueInputObjectZodSchema = makeSchema();
