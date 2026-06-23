import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskItemWhereInputObjectSchema as TaskItemWhereInputObjectSchema } from './TaskItemWhereInput.schema';
import { TaskItemUpdateWithoutExecutionsInputObjectSchema as TaskItemUpdateWithoutExecutionsInputObjectSchema } from './TaskItemUpdateWithoutExecutionsInput.schema';
import { TaskItemUncheckedUpdateWithoutExecutionsInputObjectSchema as TaskItemUncheckedUpdateWithoutExecutionsInputObjectSchema } from './TaskItemUncheckedUpdateWithoutExecutionsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskItemWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => TaskItemUpdateWithoutExecutionsInputObjectSchema), z.lazy(() => TaskItemUncheckedUpdateWithoutExecutionsInputObjectSchema)])
}).strict();
export const TaskItemUpdateToOneWithWhereWithoutExecutionsInputObjectSchema: z.ZodType<Prisma.TaskItemUpdateToOneWithWhereWithoutExecutionsInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemUpdateToOneWithWhereWithoutExecutionsInput>;
export const TaskItemUpdateToOneWithWhereWithoutExecutionsInputObjectZodSchema = makeSchema();
