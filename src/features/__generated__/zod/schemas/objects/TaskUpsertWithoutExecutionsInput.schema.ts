import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskUpdateWithoutExecutionsInputObjectSchema as TaskUpdateWithoutExecutionsInputObjectSchema } from './TaskUpdateWithoutExecutionsInput.schema';
import { TaskUncheckedUpdateWithoutExecutionsInputObjectSchema as TaskUncheckedUpdateWithoutExecutionsInputObjectSchema } from './TaskUncheckedUpdateWithoutExecutionsInput.schema';
import { TaskCreateWithoutExecutionsInputObjectSchema as TaskCreateWithoutExecutionsInputObjectSchema } from './TaskCreateWithoutExecutionsInput.schema';
import { TaskUncheckedCreateWithoutExecutionsInputObjectSchema as TaskUncheckedCreateWithoutExecutionsInputObjectSchema } from './TaskUncheckedCreateWithoutExecutionsInput.schema';
import { TaskWhereInputObjectSchema as TaskWhereInputObjectSchema } from './TaskWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => TaskUpdateWithoutExecutionsInputObjectSchema), z.lazy(() => TaskUncheckedUpdateWithoutExecutionsInputObjectSchema)]),
  create: z.union([z.lazy(() => TaskCreateWithoutExecutionsInputObjectSchema), z.lazy(() => TaskUncheckedCreateWithoutExecutionsInputObjectSchema)]),
  where: z.lazy(() => TaskWhereInputObjectSchema).optional()
}).strict();
export const TaskUpsertWithoutExecutionsInputObjectSchema: z.ZodType<Prisma.TaskUpsertWithoutExecutionsInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskUpsertWithoutExecutionsInput>;
export const TaskUpsertWithoutExecutionsInputObjectZodSchema = makeSchema();
