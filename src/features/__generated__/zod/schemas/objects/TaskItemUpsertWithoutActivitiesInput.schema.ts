import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskItemUpdateWithoutActivitiesInputObjectSchema as TaskItemUpdateWithoutActivitiesInputObjectSchema } from './TaskItemUpdateWithoutActivitiesInput.schema';
import { TaskItemUncheckedUpdateWithoutActivitiesInputObjectSchema as TaskItemUncheckedUpdateWithoutActivitiesInputObjectSchema } from './TaskItemUncheckedUpdateWithoutActivitiesInput.schema';
import { TaskItemCreateWithoutActivitiesInputObjectSchema as TaskItemCreateWithoutActivitiesInputObjectSchema } from './TaskItemCreateWithoutActivitiesInput.schema';
import { TaskItemUncheckedCreateWithoutActivitiesInputObjectSchema as TaskItemUncheckedCreateWithoutActivitiesInputObjectSchema } from './TaskItemUncheckedCreateWithoutActivitiesInput.schema';
import { TaskItemWhereInputObjectSchema as TaskItemWhereInputObjectSchema } from './TaskItemWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => TaskItemUpdateWithoutActivitiesInputObjectSchema), z.lazy(() => TaskItemUncheckedUpdateWithoutActivitiesInputObjectSchema)]),
  create: z.union([z.lazy(() => TaskItemCreateWithoutActivitiesInputObjectSchema), z.lazy(() => TaskItemUncheckedCreateWithoutActivitiesInputObjectSchema)]),
  where: z.lazy(() => TaskItemWhereInputObjectSchema).optional()
}).strict();
export const TaskItemUpsertWithoutActivitiesInputObjectSchema: z.ZodType<Prisma.TaskItemUpsertWithoutActivitiesInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemUpsertWithoutActivitiesInput>;
export const TaskItemUpsertWithoutActivitiesInputObjectZodSchema = makeSchema();
