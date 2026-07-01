import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskItemActivityWhereUniqueInputObjectSchema as TaskItemActivityWhereUniqueInputObjectSchema } from './TaskItemActivityWhereUniqueInput.schema';
import { TaskItemActivityCreateWithoutActorUserInputObjectSchema as TaskItemActivityCreateWithoutActorUserInputObjectSchema } from './TaskItemActivityCreateWithoutActorUserInput.schema';
import { TaskItemActivityUncheckedCreateWithoutActorUserInputObjectSchema as TaskItemActivityUncheckedCreateWithoutActorUserInputObjectSchema } from './TaskItemActivityUncheckedCreateWithoutActorUserInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskItemActivityWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => TaskItemActivityCreateWithoutActorUserInputObjectSchema), z.lazy(() => TaskItemActivityUncheckedCreateWithoutActorUserInputObjectSchema)])
}).strict();
export const TaskItemActivityCreateOrConnectWithoutActorUserInputObjectSchema: z.ZodType<Prisma.TaskItemActivityCreateOrConnectWithoutActorUserInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemActivityCreateOrConnectWithoutActorUserInput>;
export const TaskItemActivityCreateOrConnectWithoutActorUserInputObjectZodSchema = makeSchema();
