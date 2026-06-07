import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskWhereInputObjectSchema as TaskWhereInputObjectSchema } from './TaskWhereInput.schema';
import { TaskUpdateWithoutNotificationsInputObjectSchema as TaskUpdateWithoutNotificationsInputObjectSchema } from './TaskUpdateWithoutNotificationsInput.schema';
import { TaskUncheckedUpdateWithoutNotificationsInputObjectSchema as TaskUncheckedUpdateWithoutNotificationsInputObjectSchema } from './TaskUncheckedUpdateWithoutNotificationsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => TaskUpdateWithoutNotificationsInputObjectSchema), z.lazy(() => TaskUncheckedUpdateWithoutNotificationsInputObjectSchema)])
}).strict();
export const TaskUpdateToOneWithWhereWithoutNotificationsInputObjectSchema: z.ZodType<Prisma.TaskUpdateToOneWithWhereWithoutNotificationsInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskUpdateToOneWithWhereWithoutNotificationsInput>;
export const TaskUpdateToOneWithWhereWithoutNotificationsInputObjectZodSchema = makeSchema();
