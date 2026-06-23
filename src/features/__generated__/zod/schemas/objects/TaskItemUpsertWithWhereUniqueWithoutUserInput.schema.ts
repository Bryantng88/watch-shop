import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskItemWhereUniqueInputObjectSchema as TaskItemWhereUniqueInputObjectSchema } from './TaskItemWhereUniqueInput.schema';
import { TaskItemUpdateWithoutUserInputObjectSchema as TaskItemUpdateWithoutUserInputObjectSchema } from './TaskItemUpdateWithoutUserInput.schema';
import { TaskItemUncheckedUpdateWithoutUserInputObjectSchema as TaskItemUncheckedUpdateWithoutUserInputObjectSchema } from './TaskItemUncheckedUpdateWithoutUserInput.schema';
import { TaskItemCreateWithoutUserInputObjectSchema as TaskItemCreateWithoutUserInputObjectSchema } from './TaskItemCreateWithoutUserInput.schema';
import { TaskItemUncheckedCreateWithoutUserInputObjectSchema as TaskItemUncheckedCreateWithoutUserInputObjectSchema } from './TaskItemUncheckedCreateWithoutUserInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskItemWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => TaskItemUpdateWithoutUserInputObjectSchema), z.lazy(() => TaskItemUncheckedUpdateWithoutUserInputObjectSchema)]),
  create: z.union([z.lazy(() => TaskItemCreateWithoutUserInputObjectSchema), z.lazy(() => TaskItemUncheckedCreateWithoutUserInputObjectSchema)])
}).strict();
export const TaskItemUpsertWithWhereUniqueWithoutUserInputObjectSchema: z.ZodType<Prisma.TaskItemUpsertWithWhereUniqueWithoutUserInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemUpsertWithWhereUniqueWithoutUserInput>;
export const TaskItemUpsertWithWhereUniqueWithoutUserInputObjectZodSchema = makeSchema();
