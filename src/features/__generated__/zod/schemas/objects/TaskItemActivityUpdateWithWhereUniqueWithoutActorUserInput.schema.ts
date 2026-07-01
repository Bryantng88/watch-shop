import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskItemActivityWhereUniqueInputObjectSchema as TaskItemActivityWhereUniqueInputObjectSchema } from './TaskItemActivityWhereUniqueInput.schema';
import { TaskItemActivityUpdateWithoutActorUserInputObjectSchema as TaskItemActivityUpdateWithoutActorUserInputObjectSchema } from './TaskItemActivityUpdateWithoutActorUserInput.schema';
import { TaskItemActivityUncheckedUpdateWithoutActorUserInputObjectSchema as TaskItemActivityUncheckedUpdateWithoutActorUserInputObjectSchema } from './TaskItemActivityUncheckedUpdateWithoutActorUserInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskItemActivityWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => TaskItemActivityUpdateWithoutActorUserInputObjectSchema), z.lazy(() => TaskItemActivityUncheckedUpdateWithoutActorUserInputObjectSchema)])
}).strict();
export const TaskItemActivityUpdateWithWhereUniqueWithoutActorUserInputObjectSchema: z.ZodType<Prisma.TaskItemActivityUpdateWithWhereUniqueWithoutActorUserInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemActivityUpdateWithWhereUniqueWithoutActorUserInput>;
export const TaskItemActivityUpdateWithWhereUniqueWithoutActorUserInputObjectZodSchema = makeSchema();
