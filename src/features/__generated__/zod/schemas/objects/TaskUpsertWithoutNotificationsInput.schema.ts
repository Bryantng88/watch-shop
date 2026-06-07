import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskUpdateWithoutNotificationsInputObjectSchema as TaskUpdateWithoutNotificationsInputObjectSchema } from './TaskUpdateWithoutNotificationsInput.schema';
import { TaskUncheckedUpdateWithoutNotificationsInputObjectSchema as TaskUncheckedUpdateWithoutNotificationsInputObjectSchema } from './TaskUncheckedUpdateWithoutNotificationsInput.schema';
import { TaskCreateWithoutNotificationsInputObjectSchema as TaskCreateWithoutNotificationsInputObjectSchema } from './TaskCreateWithoutNotificationsInput.schema';
import { TaskUncheckedCreateWithoutNotificationsInputObjectSchema as TaskUncheckedCreateWithoutNotificationsInputObjectSchema } from './TaskUncheckedCreateWithoutNotificationsInput.schema';
import { TaskWhereInputObjectSchema as TaskWhereInputObjectSchema } from './TaskWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => TaskUpdateWithoutNotificationsInputObjectSchema), z.lazy(() => TaskUncheckedUpdateWithoutNotificationsInputObjectSchema)]),
  create: z.union([z.lazy(() => TaskCreateWithoutNotificationsInputObjectSchema), z.lazy(() => TaskUncheckedCreateWithoutNotificationsInputObjectSchema)]),
  where: z.lazy(() => TaskWhereInputObjectSchema).optional()
}).strict();
export const TaskUpsertWithoutNotificationsInputObjectSchema: z.ZodType<Prisma.TaskUpsertWithoutNotificationsInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskUpsertWithoutNotificationsInput>;
export const TaskUpsertWithoutNotificationsInputObjectZodSchema = makeSchema();
