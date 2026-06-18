import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskChecklistItemWhereInputObjectSchema as TaskChecklistItemWhereInputObjectSchema } from './TaskChecklistItemWhereInput.schema';
import { TaskChecklistItemUpdateWithoutExecutionsInputObjectSchema as TaskChecklistItemUpdateWithoutExecutionsInputObjectSchema } from './TaskChecklistItemUpdateWithoutExecutionsInput.schema';
import { TaskChecklistItemUncheckedUpdateWithoutExecutionsInputObjectSchema as TaskChecklistItemUncheckedUpdateWithoutExecutionsInputObjectSchema } from './TaskChecklistItemUncheckedUpdateWithoutExecutionsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskChecklistItemWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => TaskChecklistItemUpdateWithoutExecutionsInputObjectSchema), z.lazy(() => TaskChecklistItemUncheckedUpdateWithoutExecutionsInputObjectSchema)])
}).strict();
export const TaskChecklistItemUpdateToOneWithWhereWithoutExecutionsInputObjectSchema: z.ZodType<Prisma.TaskChecklistItemUpdateToOneWithWhereWithoutExecutionsInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskChecklistItemUpdateToOneWithWhereWithoutExecutionsInput>;
export const TaskChecklistItemUpdateToOneWithWhereWithoutExecutionsInputObjectZodSchema = makeSchema();
