import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskItemActivityReplyScalarWhereInputObjectSchema as TaskItemActivityReplyScalarWhereInputObjectSchema } from './TaskItemActivityReplyScalarWhereInput.schema';
import { TaskItemActivityReplyUpdateManyMutationInputObjectSchema as TaskItemActivityReplyUpdateManyMutationInputObjectSchema } from './TaskItemActivityReplyUpdateManyMutationInput.schema';
import { TaskItemActivityReplyUncheckedUpdateManyWithoutActorUserInputObjectSchema as TaskItemActivityReplyUncheckedUpdateManyWithoutActorUserInputObjectSchema } from './TaskItemActivityReplyUncheckedUpdateManyWithoutActorUserInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskItemActivityReplyScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => TaskItemActivityReplyUpdateManyMutationInputObjectSchema), z.lazy(() => TaskItemActivityReplyUncheckedUpdateManyWithoutActorUserInputObjectSchema)])
}).strict();
export const TaskItemActivityReplyUpdateManyWithWhereWithoutActorUserInputObjectSchema: z.ZodType<Prisma.TaskItemActivityReplyUpdateManyWithWhereWithoutActorUserInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemActivityReplyUpdateManyWithWhereWithoutActorUserInput>;
export const TaskItemActivityReplyUpdateManyWithWhereWithoutActorUserInputObjectZodSchema = makeSchema();
