import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskChecklistItemWhereUniqueInputObjectSchema as TaskChecklistItemWhereUniqueInputObjectSchema } from './TaskChecklistItemWhereUniqueInput.schema';
import { TaskChecklistItemUpdateWithoutUserInputObjectSchema as TaskChecklistItemUpdateWithoutUserInputObjectSchema } from './TaskChecklistItemUpdateWithoutUserInput.schema';
import { TaskChecklistItemUncheckedUpdateWithoutUserInputObjectSchema as TaskChecklistItemUncheckedUpdateWithoutUserInputObjectSchema } from './TaskChecklistItemUncheckedUpdateWithoutUserInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskChecklistItemWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => TaskChecklistItemUpdateWithoutUserInputObjectSchema), z.lazy(() => TaskChecklistItemUncheckedUpdateWithoutUserInputObjectSchema)])
}).strict();
export const TaskChecklistItemUpdateWithWhereUniqueWithoutUserInputObjectSchema: z.ZodType<Prisma.TaskChecklistItemUpdateWithWhereUniqueWithoutUserInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskChecklistItemUpdateWithWhereUniqueWithoutUserInput>;
export const TaskChecklistItemUpdateWithWhereUniqueWithoutUserInputObjectZodSchema = makeSchema();
