import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskChecklistItemWhereUniqueInputObjectSchema as TaskChecklistItemWhereUniqueInputObjectSchema } from './TaskChecklistItemWhereUniqueInput.schema';
import { TaskChecklistItemUpdateWithoutUserInputObjectSchema as TaskChecklistItemUpdateWithoutUserInputObjectSchema } from './TaskChecklistItemUpdateWithoutUserInput.schema';
import { TaskChecklistItemUncheckedUpdateWithoutUserInputObjectSchema as TaskChecklistItemUncheckedUpdateWithoutUserInputObjectSchema } from './TaskChecklistItemUncheckedUpdateWithoutUserInput.schema';
import { TaskChecklistItemCreateWithoutUserInputObjectSchema as TaskChecklistItemCreateWithoutUserInputObjectSchema } from './TaskChecklistItemCreateWithoutUserInput.schema';
import { TaskChecklistItemUncheckedCreateWithoutUserInputObjectSchema as TaskChecklistItemUncheckedCreateWithoutUserInputObjectSchema } from './TaskChecklistItemUncheckedCreateWithoutUserInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskChecklistItemWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => TaskChecklistItemUpdateWithoutUserInputObjectSchema), z.lazy(() => TaskChecklistItemUncheckedUpdateWithoutUserInputObjectSchema)]),
  create: z.union([z.lazy(() => TaskChecklistItemCreateWithoutUserInputObjectSchema), z.lazy(() => TaskChecklistItemUncheckedCreateWithoutUserInputObjectSchema)])
}).strict();
export const TaskChecklistItemUpsertWithWhereUniqueWithoutUserInputObjectSchema: z.ZodType<Prisma.TaskChecklistItemUpsertWithWhereUniqueWithoutUserInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskChecklistItemUpsertWithWhereUniqueWithoutUserInput>;
export const TaskChecklistItemUpsertWithWhereUniqueWithoutUserInputObjectZodSchema = makeSchema();
