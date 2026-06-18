import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskChecklistItemUpdateWithoutExecutionsInputObjectSchema as TaskChecklistItemUpdateWithoutExecutionsInputObjectSchema } from './TaskChecklistItemUpdateWithoutExecutionsInput.schema';
import { TaskChecklistItemUncheckedUpdateWithoutExecutionsInputObjectSchema as TaskChecklistItemUncheckedUpdateWithoutExecutionsInputObjectSchema } from './TaskChecklistItemUncheckedUpdateWithoutExecutionsInput.schema';
import { TaskChecklistItemCreateWithoutExecutionsInputObjectSchema as TaskChecklistItemCreateWithoutExecutionsInputObjectSchema } from './TaskChecklistItemCreateWithoutExecutionsInput.schema';
import { TaskChecklistItemUncheckedCreateWithoutExecutionsInputObjectSchema as TaskChecklistItemUncheckedCreateWithoutExecutionsInputObjectSchema } from './TaskChecklistItemUncheckedCreateWithoutExecutionsInput.schema';
import { TaskChecklistItemWhereInputObjectSchema as TaskChecklistItemWhereInputObjectSchema } from './TaskChecklistItemWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => TaskChecklistItemUpdateWithoutExecutionsInputObjectSchema), z.lazy(() => TaskChecklistItemUncheckedUpdateWithoutExecutionsInputObjectSchema)]),
  create: z.union([z.lazy(() => TaskChecklistItemCreateWithoutExecutionsInputObjectSchema), z.lazy(() => TaskChecklistItemUncheckedCreateWithoutExecutionsInputObjectSchema)]),
  where: z.lazy(() => TaskChecklistItemWhereInputObjectSchema).optional()
}).strict();
export const TaskChecklistItemUpsertWithoutExecutionsInputObjectSchema: z.ZodType<Prisma.TaskChecklistItemUpsertWithoutExecutionsInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskChecklistItemUpsertWithoutExecutionsInput>;
export const TaskChecklistItemUpsertWithoutExecutionsInputObjectZodSchema = makeSchema();
