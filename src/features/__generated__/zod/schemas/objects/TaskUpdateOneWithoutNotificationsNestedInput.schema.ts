import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskCreateWithoutNotificationsInputObjectSchema as TaskCreateWithoutNotificationsInputObjectSchema } from './TaskCreateWithoutNotificationsInput.schema';
import { TaskUncheckedCreateWithoutNotificationsInputObjectSchema as TaskUncheckedCreateWithoutNotificationsInputObjectSchema } from './TaskUncheckedCreateWithoutNotificationsInput.schema';
import { TaskCreateOrConnectWithoutNotificationsInputObjectSchema as TaskCreateOrConnectWithoutNotificationsInputObjectSchema } from './TaskCreateOrConnectWithoutNotificationsInput.schema';
import { TaskUpsertWithoutNotificationsInputObjectSchema as TaskUpsertWithoutNotificationsInputObjectSchema } from './TaskUpsertWithoutNotificationsInput.schema';
import { TaskWhereInputObjectSchema as TaskWhereInputObjectSchema } from './TaskWhereInput.schema';
import { TaskWhereUniqueInputObjectSchema as TaskWhereUniqueInputObjectSchema } from './TaskWhereUniqueInput.schema';
import { TaskUpdateToOneWithWhereWithoutNotificationsInputObjectSchema as TaskUpdateToOneWithWhereWithoutNotificationsInputObjectSchema } from './TaskUpdateToOneWithWhereWithoutNotificationsInput.schema';
import { TaskUpdateWithoutNotificationsInputObjectSchema as TaskUpdateWithoutNotificationsInputObjectSchema } from './TaskUpdateWithoutNotificationsInput.schema';
import { TaskUncheckedUpdateWithoutNotificationsInputObjectSchema as TaskUncheckedUpdateWithoutNotificationsInputObjectSchema } from './TaskUncheckedUpdateWithoutNotificationsInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TaskCreateWithoutNotificationsInputObjectSchema), z.lazy(() => TaskUncheckedCreateWithoutNotificationsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => TaskCreateOrConnectWithoutNotificationsInputObjectSchema).optional(),
  upsert: z.lazy(() => TaskUpsertWithoutNotificationsInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => TaskWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => TaskWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => TaskWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => TaskUpdateToOneWithWhereWithoutNotificationsInputObjectSchema), z.lazy(() => TaskUpdateWithoutNotificationsInputObjectSchema), z.lazy(() => TaskUncheckedUpdateWithoutNotificationsInputObjectSchema)]).optional()
}).strict();
export const TaskUpdateOneWithoutNotificationsNestedInputObjectSchema: z.ZodType<Prisma.TaskUpdateOneWithoutNotificationsNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskUpdateOneWithoutNotificationsNestedInput>;
export const TaskUpdateOneWithoutNotificationsNestedInputObjectZodSchema = makeSchema();
