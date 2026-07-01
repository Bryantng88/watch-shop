import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskItemActivityReplyWhereUniqueInputObjectSchema as TaskItemActivityReplyWhereUniqueInputObjectSchema } from './TaskItemActivityReplyWhereUniqueInput.schema';
import { TaskItemActivityReplyUpdateWithoutActorUserInputObjectSchema as TaskItemActivityReplyUpdateWithoutActorUserInputObjectSchema } from './TaskItemActivityReplyUpdateWithoutActorUserInput.schema';
import { TaskItemActivityReplyUncheckedUpdateWithoutActorUserInputObjectSchema as TaskItemActivityReplyUncheckedUpdateWithoutActorUserInputObjectSchema } from './TaskItemActivityReplyUncheckedUpdateWithoutActorUserInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskItemActivityReplyWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => TaskItemActivityReplyUpdateWithoutActorUserInputObjectSchema), z.lazy(() => TaskItemActivityReplyUncheckedUpdateWithoutActorUserInputObjectSchema)])
}).strict();
export const TaskItemActivityReplyUpdateWithWhereUniqueWithoutActorUserInputObjectSchema: z.ZodType<Prisma.TaskItemActivityReplyUpdateWithWhereUniqueWithoutActorUserInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemActivityReplyUpdateWithWhereUniqueWithoutActorUserInput>;
export const TaskItemActivityReplyUpdateWithWhereUniqueWithoutActorUserInputObjectZodSchema = makeSchema();
