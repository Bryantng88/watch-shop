import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskWhereInputObjectSchema as TaskWhereInputObjectSchema } from './TaskWhereInput.schema';
import { TaskUpdateWithoutExecutionsInputObjectSchema as TaskUpdateWithoutExecutionsInputObjectSchema } from './TaskUpdateWithoutExecutionsInput.schema';
import { TaskUncheckedUpdateWithoutExecutionsInputObjectSchema as TaskUncheckedUpdateWithoutExecutionsInputObjectSchema } from './TaskUncheckedUpdateWithoutExecutionsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => TaskUpdateWithoutExecutionsInputObjectSchema), z.lazy(() => TaskUncheckedUpdateWithoutExecutionsInputObjectSchema)])
}).strict();
export const TaskUpdateToOneWithWhereWithoutExecutionsInputObjectSchema: z.ZodType<Prisma.TaskUpdateToOneWithWhereWithoutExecutionsInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskUpdateToOneWithWhereWithoutExecutionsInput>;
export const TaskUpdateToOneWithWhereWithoutExecutionsInputObjectZodSchema = makeSchema();
