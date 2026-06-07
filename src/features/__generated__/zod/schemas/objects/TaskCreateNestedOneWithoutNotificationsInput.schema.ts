import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskCreateWithoutNotificationsInputObjectSchema as TaskCreateWithoutNotificationsInputObjectSchema } from './TaskCreateWithoutNotificationsInput.schema';
import { TaskUncheckedCreateWithoutNotificationsInputObjectSchema as TaskUncheckedCreateWithoutNotificationsInputObjectSchema } from './TaskUncheckedCreateWithoutNotificationsInput.schema';
import { TaskCreateOrConnectWithoutNotificationsInputObjectSchema as TaskCreateOrConnectWithoutNotificationsInputObjectSchema } from './TaskCreateOrConnectWithoutNotificationsInput.schema';
import { TaskWhereUniqueInputObjectSchema as TaskWhereUniqueInputObjectSchema } from './TaskWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TaskCreateWithoutNotificationsInputObjectSchema), z.lazy(() => TaskUncheckedCreateWithoutNotificationsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => TaskCreateOrConnectWithoutNotificationsInputObjectSchema).optional(),
  connect: z.lazy(() => TaskWhereUniqueInputObjectSchema).optional()
}).strict();
export const TaskCreateNestedOneWithoutNotificationsInputObjectSchema: z.ZodType<Prisma.TaskCreateNestedOneWithoutNotificationsInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskCreateNestedOneWithoutNotificationsInput>;
export const TaskCreateNestedOneWithoutNotificationsInputObjectZodSchema = makeSchema();
