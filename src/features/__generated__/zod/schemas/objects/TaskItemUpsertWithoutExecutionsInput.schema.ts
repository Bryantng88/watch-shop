import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskItemUpdateWithoutExecutionsInputObjectSchema as TaskItemUpdateWithoutExecutionsInputObjectSchema } from './TaskItemUpdateWithoutExecutionsInput.schema';
import { TaskItemUncheckedUpdateWithoutExecutionsInputObjectSchema as TaskItemUncheckedUpdateWithoutExecutionsInputObjectSchema } from './TaskItemUncheckedUpdateWithoutExecutionsInput.schema';
import { TaskItemCreateWithoutExecutionsInputObjectSchema as TaskItemCreateWithoutExecutionsInputObjectSchema } from './TaskItemCreateWithoutExecutionsInput.schema';
import { TaskItemUncheckedCreateWithoutExecutionsInputObjectSchema as TaskItemUncheckedCreateWithoutExecutionsInputObjectSchema } from './TaskItemUncheckedCreateWithoutExecutionsInput.schema';
import { TaskItemWhereInputObjectSchema as TaskItemWhereInputObjectSchema } from './TaskItemWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => TaskItemUpdateWithoutExecutionsInputObjectSchema), z.lazy(() => TaskItemUncheckedUpdateWithoutExecutionsInputObjectSchema)]),
  create: z.union([z.lazy(() => TaskItemCreateWithoutExecutionsInputObjectSchema), z.lazy(() => TaskItemUncheckedCreateWithoutExecutionsInputObjectSchema)]),
  where: z.lazy(() => TaskItemWhereInputObjectSchema).optional()
}).strict();
export const TaskItemUpsertWithoutExecutionsInputObjectSchema: z.ZodType<Prisma.TaskItemUpsertWithoutExecutionsInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemUpsertWithoutExecutionsInput>;
export const TaskItemUpsertWithoutExecutionsInputObjectZodSchema = makeSchema();
