import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskCreateWithoutExecutionsInputObjectSchema as TaskCreateWithoutExecutionsInputObjectSchema } from './TaskCreateWithoutExecutionsInput.schema';
import { TaskUncheckedCreateWithoutExecutionsInputObjectSchema as TaskUncheckedCreateWithoutExecutionsInputObjectSchema } from './TaskUncheckedCreateWithoutExecutionsInput.schema';
import { TaskCreateOrConnectWithoutExecutionsInputObjectSchema as TaskCreateOrConnectWithoutExecutionsInputObjectSchema } from './TaskCreateOrConnectWithoutExecutionsInput.schema';
import { TaskUpsertWithoutExecutionsInputObjectSchema as TaskUpsertWithoutExecutionsInputObjectSchema } from './TaskUpsertWithoutExecutionsInput.schema';
import { TaskWhereUniqueInputObjectSchema as TaskWhereUniqueInputObjectSchema } from './TaskWhereUniqueInput.schema';
import { TaskUpdateToOneWithWhereWithoutExecutionsInputObjectSchema as TaskUpdateToOneWithWhereWithoutExecutionsInputObjectSchema } from './TaskUpdateToOneWithWhereWithoutExecutionsInput.schema';
import { TaskUpdateWithoutExecutionsInputObjectSchema as TaskUpdateWithoutExecutionsInputObjectSchema } from './TaskUpdateWithoutExecutionsInput.schema';
import { TaskUncheckedUpdateWithoutExecutionsInputObjectSchema as TaskUncheckedUpdateWithoutExecutionsInputObjectSchema } from './TaskUncheckedUpdateWithoutExecutionsInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TaskCreateWithoutExecutionsInputObjectSchema), z.lazy(() => TaskUncheckedCreateWithoutExecutionsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => TaskCreateOrConnectWithoutExecutionsInputObjectSchema).optional(),
  upsert: z.lazy(() => TaskUpsertWithoutExecutionsInputObjectSchema).optional(),
  connect: z.lazy(() => TaskWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => TaskUpdateToOneWithWhereWithoutExecutionsInputObjectSchema), z.lazy(() => TaskUpdateWithoutExecutionsInputObjectSchema), z.lazy(() => TaskUncheckedUpdateWithoutExecutionsInputObjectSchema)]).optional()
}).strict();
export const TaskUpdateOneRequiredWithoutExecutionsNestedInputObjectSchema: z.ZodType<Prisma.TaskUpdateOneRequiredWithoutExecutionsNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskUpdateOneRequiredWithoutExecutionsNestedInput>;
export const TaskUpdateOneRequiredWithoutExecutionsNestedInputObjectZodSchema = makeSchema();
