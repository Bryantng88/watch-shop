import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskItemWhereInputObjectSchema as TaskItemWhereInputObjectSchema } from './TaskItemWhereInput.schema';
import { TaskItemUpdateWithoutActivitiesInputObjectSchema as TaskItemUpdateWithoutActivitiesInputObjectSchema } from './TaskItemUpdateWithoutActivitiesInput.schema';
import { TaskItemUncheckedUpdateWithoutActivitiesInputObjectSchema as TaskItemUncheckedUpdateWithoutActivitiesInputObjectSchema } from './TaskItemUncheckedUpdateWithoutActivitiesInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskItemWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => TaskItemUpdateWithoutActivitiesInputObjectSchema), z.lazy(() => TaskItemUncheckedUpdateWithoutActivitiesInputObjectSchema)])
}).strict();
export const TaskItemUpdateToOneWithWhereWithoutActivitiesInputObjectSchema: z.ZodType<Prisma.TaskItemUpdateToOneWithWhereWithoutActivitiesInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemUpdateToOneWithWhereWithoutActivitiesInput>;
export const TaskItemUpdateToOneWithWhereWithoutActivitiesInputObjectZodSchema = makeSchema();
