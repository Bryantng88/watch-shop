import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskItemWhereInputObjectSchema as TaskItemWhereInputObjectSchema } from './TaskItemWhereInput.schema';
import { TaskItemUpdateWithoutChecklistsInputObjectSchema as TaskItemUpdateWithoutChecklistsInputObjectSchema } from './TaskItemUpdateWithoutChecklistsInput.schema';
import { TaskItemUncheckedUpdateWithoutChecklistsInputObjectSchema as TaskItemUncheckedUpdateWithoutChecklistsInputObjectSchema } from './TaskItemUncheckedUpdateWithoutChecklistsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskItemWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => TaskItemUpdateWithoutChecklistsInputObjectSchema), z.lazy(() => TaskItemUncheckedUpdateWithoutChecklistsInputObjectSchema)])
}).strict();
export const TaskItemUpdateToOneWithWhereWithoutChecklistsInputObjectSchema: z.ZodType<Prisma.TaskItemUpdateToOneWithWhereWithoutChecklistsInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemUpdateToOneWithWhereWithoutChecklistsInput>;
export const TaskItemUpdateToOneWithWhereWithoutChecklistsInputObjectZodSchema = makeSchema();
