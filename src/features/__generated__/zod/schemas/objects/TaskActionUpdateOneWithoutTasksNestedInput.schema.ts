import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskActionCreateWithoutTasksInputObjectSchema as TaskActionCreateWithoutTasksInputObjectSchema } from './TaskActionCreateWithoutTasksInput.schema';
import { TaskActionUncheckedCreateWithoutTasksInputObjectSchema as TaskActionUncheckedCreateWithoutTasksInputObjectSchema } from './TaskActionUncheckedCreateWithoutTasksInput.schema';
import { TaskActionCreateOrConnectWithoutTasksInputObjectSchema as TaskActionCreateOrConnectWithoutTasksInputObjectSchema } from './TaskActionCreateOrConnectWithoutTasksInput.schema';
import { TaskActionUpsertWithoutTasksInputObjectSchema as TaskActionUpsertWithoutTasksInputObjectSchema } from './TaskActionUpsertWithoutTasksInput.schema';
import { TaskActionWhereInputObjectSchema as TaskActionWhereInputObjectSchema } from './TaskActionWhereInput.schema';
import { TaskActionWhereUniqueInputObjectSchema as TaskActionWhereUniqueInputObjectSchema } from './TaskActionWhereUniqueInput.schema';
import { TaskActionUpdateToOneWithWhereWithoutTasksInputObjectSchema as TaskActionUpdateToOneWithWhereWithoutTasksInputObjectSchema } from './TaskActionUpdateToOneWithWhereWithoutTasksInput.schema';
import { TaskActionUpdateWithoutTasksInputObjectSchema as TaskActionUpdateWithoutTasksInputObjectSchema } from './TaskActionUpdateWithoutTasksInput.schema';
import { TaskActionUncheckedUpdateWithoutTasksInputObjectSchema as TaskActionUncheckedUpdateWithoutTasksInputObjectSchema } from './TaskActionUncheckedUpdateWithoutTasksInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TaskActionCreateWithoutTasksInputObjectSchema), z.lazy(() => TaskActionUncheckedCreateWithoutTasksInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => TaskActionCreateOrConnectWithoutTasksInputObjectSchema).optional(),
  upsert: z.lazy(() => TaskActionUpsertWithoutTasksInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => TaskActionWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => TaskActionWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => TaskActionWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => TaskActionUpdateToOneWithWhereWithoutTasksInputObjectSchema), z.lazy(() => TaskActionUpdateWithoutTasksInputObjectSchema), z.lazy(() => TaskActionUncheckedUpdateWithoutTasksInputObjectSchema)]).optional()
}).strict();
export const TaskActionUpdateOneWithoutTasksNestedInputObjectSchema: z.ZodType<Prisma.TaskActionUpdateOneWithoutTasksNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskActionUpdateOneWithoutTasksNestedInput>;
export const TaskActionUpdateOneWithoutTasksNestedInputObjectZodSchema = makeSchema();
