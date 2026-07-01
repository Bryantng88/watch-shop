import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskItemActivityReplyWhereUniqueInputObjectSchema as TaskItemActivityReplyWhereUniqueInputObjectSchema } from './TaskItemActivityReplyWhereUniqueInput.schema';
import { TaskItemActivityReplyCreateWithoutActorUserInputObjectSchema as TaskItemActivityReplyCreateWithoutActorUserInputObjectSchema } from './TaskItemActivityReplyCreateWithoutActorUserInput.schema';
import { TaskItemActivityReplyUncheckedCreateWithoutActorUserInputObjectSchema as TaskItemActivityReplyUncheckedCreateWithoutActorUserInputObjectSchema } from './TaskItemActivityReplyUncheckedCreateWithoutActorUserInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskItemActivityReplyWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => TaskItemActivityReplyCreateWithoutActorUserInputObjectSchema), z.lazy(() => TaskItemActivityReplyUncheckedCreateWithoutActorUserInputObjectSchema)])
}).strict();
export const TaskItemActivityReplyCreateOrConnectWithoutActorUserInputObjectSchema: z.ZodType<Prisma.TaskItemActivityReplyCreateOrConnectWithoutActorUserInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemActivityReplyCreateOrConnectWithoutActorUserInput>;
export const TaskItemActivityReplyCreateOrConnectWithoutActorUserInputObjectZodSchema = makeSchema();
