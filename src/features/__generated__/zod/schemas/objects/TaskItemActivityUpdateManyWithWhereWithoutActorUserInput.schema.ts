import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskItemActivityScalarWhereInputObjectSchema as TaskItemActivityScalarWhereInputObjectSchema } from './TaskItemActivityScalarWhereInput.schema';
import { TaskItemActivityUpdateManyMutationInputObjectSchema as TaskItemActivityUpdateManyMutationInputObjectSchema } from './TaskItemActivityUpdateManyMutationInput.schema';
import { TaskItemActivityUncheckedUpdateManyWithoutActorUserInputObjectSchema as TaskItemActivityUncheckedUpdateManyWithoutActorUserInputObjectSchema } from './TaskItemActivityUncheckedUpdateManyWithoutActorUserInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskItemActivityScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => TaskItemActivityUpdateManyMutationInputObjectSchema), z.lazy(() => TaskItemActivityUncheckedUpdateManyWithoutActorUserInputObjectSchema)])
}).strict();
export const TaskItemActivityUpdateManyWithWhereWithoutActorUserInputObjectSchema: z.ZodType<Prisma.TaskItemActivityUpdateManyWithWhereWithoutActorUserInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemActivityUpdateManyWithWhereWithoutActorUserInput>;
export const TaskItemActivityUpdateManyWithWhereWithoutActorUserInputObjectZodSchema = makeSchema();
