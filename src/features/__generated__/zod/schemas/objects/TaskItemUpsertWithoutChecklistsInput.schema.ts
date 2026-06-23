import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskItemUpdateWithoutChecklistsInputObjectSchema as TaskItemUpdateWithoutChecklistsInputObjectSchema } from './TaskItemUpdateWithoutChecklistsInput.schema';
import { TaskItemUncheckedUpdateWithoutChecklistsInputObjectSchema as TaskItemUncheckedUpdateWithoutChecklistsInputObjectSchema } from './TaskItemUncheckedUpdateWithoutChecklistsInput.schema';
import { TaskItemCreateWithoutChecklistsInputObjectSchema as TaskItemCreateWithoutChecklistsInputObjectSchema } from './TaskItemCreateWithoutChecklistsInput.schema';
import { TaskItemUncheckedCreateWithoutChecklistsInputObjectSchema as TaskItemUncheckedCreateWithoutChecklistsInputObjectSchema } from './TaskItemUncheckedCreateWithoutChecklistsInput.schema';
import { TaskItemWhereInputObjectSchema as TaskItemWhereInputObjectSchema } from './TaskItemWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => TaskItemUpdateWithoutChecklistsInputObjectSchema), z.lazy(() => TaskItemUncheckedUpdateWithoutChecklistsInputObjectSchema)]),
  create: z.union([z.lazy(() => TaskItemCreateWithoutChecklistsInputObjectSchema), z.lazy(() => TaskItemUncheckedCreateWithoutChecklistsInputObjectSchema)]),
  where: z.lazy(() => TaskItemWhereInputObjectSchema).optional()
}).strict();
export const TaskItemUpsertWithoutChecklistsInputObjectSchema: z.ZodType<Prisma.TaskItemUpsertWithoutChecklistsInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemUpsertWithoutChecklistsInput>;
export const TaskItemUpsertWithoutChecklistsInputObjectZodSchema = makeSchema();
