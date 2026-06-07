import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskWhereUniqueInputObjectSchema as TaskWhereUniqueInputObjectSchema } from './TaskWhereUniqueInput.schema';
import { TaskCreateWithoutNotificationsInputObjectSchema as TaskCreateWithoutNotificationsInputObjectSchema } from './TaskCreateWithoutNotificationsInput.schema';
import { TaskUncheckedCreateWithoutNotificationsInputObjectSchema as TaskUncheckedCreateWithoutNotificationsInputObjectSchema } from './TaskUncheckedCreateWithoutNotificationsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => TaskCreateWithoutNotificationsInputObjectSchema), z.lazy(() => TaskUncheckedCreateWithoutNotificationsInputObjectSchema)])
}).strict();
export const TaskCreateOrConnectWithoutNotificationsInputObjectSchema: z.ZodType<Prisma.TaskCreateOrConnectWithoutNotificationsInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskCreateOrConnectWithoutNotificationsInput>;
export const TaskCreateOrConnectWithoutNotificationsInputObjectZodSchema = makeSchema();
