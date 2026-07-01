import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskItemWhereUniqueInputObjectSchema as TaskItemWhereUniqueInputObjectSchema } from './TaskItemWhereUniqueInput.schema';
import { TaskItemCreateWithoutActivitiesInputObjectSchema as TaskItemCreateWithoutActivitiesInputObjectSchema } from './TaskItemCreateWithoutActivitiesInput.schema';
import { TaskItemUncheckedCreateWithoutActivitiesInputObjectSchema as TaskItemUncheckedCreateWithoutActivitiesInputObjectSchema } from './TaskItemUncheckedCreateWithoutActivitiesInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskItemWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => TaskItemCreateWithoutActivitiesInputObjectSchema), z.lazy(() => TaskItemUncheckedCreateWithoutActivitiesInputObjectSchema)])
}).strict();
export const TaskItemCreateOrConnectWithoutActivitiesInputObjectSchema: z.ZodType<Prisma.TaskItemCreateOrConnectWithoutActivitiesInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemCreateOrConnectWithoutActivitiesInput>;
export const TaskItemCreateOrConnectWithoutActivitiesInputObjectZodSchema = makeSchema();
