import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskItemActivityReplyWhereUniqueInputObjectSchema as TaskItemActivityReplyWhereUniqueInputObjectSchema } from './TaskItemActivityReplyWhereUniqueInput.schema';
import { TaskItemActivityReplyUpdateWithoutActivityInputObjectSchema as TaskItemActivityReplyUpdateWithoutActivityInputObjectSchema } from './TaskItemActivityReplyUpdateWithoutActivityInput.schema';
import { TaskItemActivityReplyUncheckedUpdateWithoutActivityInputObjectSchema as TaskItemActivityReplyUncheckedUpdateWithoutActivityInputObjectSchema } from './TaskItemActivityReplyUncheckedUpdateWithoutActivityInput.schema';
import { TaskItemActivityReplyCreateWithoutActivityInputObjectSchema as TaskItemActivityReplyCreateWithoutActivityInputObjectSchema } from './TaskItemActivityReplyCreateWithoutActivityInput.schema';
import { TaskItemActivityReplyUncheckedCreateWithoutActivityInputObjectSchema as TaskItemActivityReplyUncheckedCreateWithoutActivityInputObjectSchema } from './TaskItemActivityReplyUncheckedCreateWithoutActivityInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskItemActivityReplyWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => TaskItemActivityReplyUpdateWithoutActivityInputObjectSchema), z.lazy(() => TaskItemActivityReplyUncheckedUpdateWithoutActivityInputObjectSchema)]),
  create: z.union([z.lazy(() => TaskItemActivityReplyCreateWithoutActivityInputObjectSchema), z.lazy(() => TaskItemActivityReplyUncheckedCreateWithoutActivityInputObjectSchema)])
}).strict();
export const TaskItemActivityReplyUpsertWithWhereUniqueWithoutActivityInputObjectSchema: z.ZodType<Prisma.TaskItemActivityReplyUpsertWithWhereUniqueWithoutActivityInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemActivityReplyUpsertWithWhereUniqueWithoutActivityInput>;
export const TaskItemActivityReplyUpsertWithWhereUniqueWithoutActivityInputObjectZodSchema = makeSchema();
