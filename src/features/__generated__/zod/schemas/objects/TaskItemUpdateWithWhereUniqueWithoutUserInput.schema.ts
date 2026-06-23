import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskItemWhereUniqueInputObjectSchema as TaskItemWhereUniqueInputObjectSchema } from './TaskItemWhereUniqueInput.schema';
import { TaskItemUpdateWithoutUserInputObjectSchema as TaskItemUpdateWithoutUserInputObjectSchema } from './TaskItemUpdateWithoutUserInput.schema';
import { TaskItemUncheckedUpdateWithoutUserInputObjectSchema as TaskItemUncheckedUpdateWithoutUserInputObjectSchema } from './TaskItemUncheckedUpdateWithoutUserInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskItemWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => TaskItemUpdateWithoutUserInputObjectSchema), z.lazy(() => TaskItemUncheckedUpdateWithoutUserInputObjectSchema)])
}).strict();
export const TaskItemUpdateWithWhereUniqueWithoutUserInputObjectSchema: z.ZodType<Prisma.TaskItemUpdateWithWhereUniqueWithoutUserInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemUpdateWithWhereUniqueWithoutUserInput>;
export const TaskItemUpdateWithWhereUniqueWithoutUserInputObjectZodSchema = makeSchema();
