import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskItemActivityReplyWhereUniqueInputObjectSchema as TaskItemActivityReplyWhereUniqueInputObjectSchema } from './TaskItemActivityReplyWhereUniqueInput.schema';
import { TaskItemActivityReplyUpdateWithoutActorUserInputObjectSchema as TaskItemActivityReplyUpdateWithoutActorUserInputObjectSchema } from './TaskItemActivityReplyUpdateWithoutActorUserInput.schema';
import { TaskItemActivityReplyUncheckedUpdateWithoutActorUserInputObjectSchema as TaskItemActivityReplyUncheckedUpdateWithoutActorUserInputObjectSchema } from './TaskItemActivityReplyUncheckedUpdateWithoutActorUserInput.schema';
import { TaskItemActivityReplyCreateWithoutActorUserInputObjectSchema as TaskItemActivityReplyCreateWithoutActorUserInputObjectSchema } from './TaskItemActivityReplyCreateWithoutActorUserInput.schema';
import { TaskItemActivityReplyUncheckedCreateWithoutActorUserInputObjectSchema as TaskItemActivityReplyUncheckedCreateWithoutActorUserInputObjectSchema } from './TaskItemActivityReplyUncheckedCreateWithoutActorUserInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskItemActivityReplyWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => TaskItemActivityReplyUpdateWithoutActorUserInputObjectSchema), z.lazy(() => TaskItemActivityReplyUncheckedUpdateWithoutActorUserInputObjectSchema)]),
  create: z.union([z.lazy(() => TaskItemActivityReplyCreateWithoutActorUserInputObjectSchema), z.lazy(() => TaskItemActivityReplyUncheckedCreateWithoutActorUserInputObjectSchema)])
}).strict();
export const TaskItemActivityReplyUpsertWithWhereUniqueWithoutActorUserInputObjectSchema: z.ZodType<Prisma.TaskItemActivityReplyUpsertWithWhereUniqueWithoutActorUserInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemActivityReplyUpsertWithWhereUniqueWithoutActorUserInput>;
export const TaskItemActivityReplyUpsertWithWhereUniqueWithoutActorUserInputObjectZodSchema = makeSchema();
