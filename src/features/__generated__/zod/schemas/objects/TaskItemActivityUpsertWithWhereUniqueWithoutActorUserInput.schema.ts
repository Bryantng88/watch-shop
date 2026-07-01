import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskItemActivityWhereUniqueInputObjectSchema as TaskItemActivityWhereUniqueInputObjectSchema } from './TaskItemActivityWhereUniqueInput.schema';
import { TaskItemActivityUpdateWithoutActorUserInputObjectSchema as TaskItemActivityUpdateWithoutActorUserInputObjectSchema } from './TaskItemActivityUpdateWithoutActorUserInput.schema';
import { TaskItemActivityUncheckedUpdateWithoutActorUserInputObjectSchema as TaskItemActivityUncheckedUpdateWithoutActorUserInputObjectSchema } from './TaskItemActivityUncheckedUpdateWithoutActorUserInput.schema';
import { TaskItemActivityCreateWithoutActorUserInputObjectSchema as TaskItemActivityCreateWithoutActorUserInputObjectSchema } from './TaskItemActivityCreateWithoutActorUserInput.schema';
import { TaskItemActivityUncheckedCreateWithoutActorUserInputObjectSchema as TaskItemActivityUncheckedCreateWithoutActorUserInputObjectSchema } from './TaskItemActivityUncheckedCreateWithoutActorUserInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskItemActivityWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => TaskItemActivityUpdateWithoutActorUserInputObjectSchema), z.lazy(() => TaskItemActivityUncheckedUpdateWithoutActorUserInputObjectSchema)]),
  create: z.union([z.lazy(() => TaskItemActivityCreateWithoutActorUserInputObjectSchema), z.lazy(() => TaskItemActivityUncheckedCreateWithoutActorUserInputObjectSchema)])
}).strict();
export const TaskItemActivityUpsertWithWhereUniqueWithoutActorUserInputObjectSchema: z.ZodType<Prisma.TaskItemActivityUpsertWithWhereUniqueWithoutActorUserInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemActivityUpsertWithWhereUniqueWithoutActorUserInput>;
export const TaskItemActivityUpsertWithWhereUniqueWithoutActorUserInputObjectZodSchema = makeSchema();
