import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskItemCreateWithoutActivitiesInputObjectSchema as TaskItemCreateWithoutActivitiesInputObjectSchema } from './TaskItemCreateWithoutActivitiesInput.schema';
import { TaskItemUncheckedCreateWithoutActivitiesInputObjectSchema as TaskItemUncheckedCreateWithoutActivitiesInputObjectSchema } from './TaskItemUncheckedCreateWithoutActivitiesInput.schema';
import { TaskItemCreateOrConnectWithoutActivitiesInputObjectSchema as TaskItemCreateOrConnectWithoutActivitiesInputObjectSchema } from './TaskItemCreateOrConnectWithoutActivitiesInput.schema';
import { TaskItemWhereUniqueInputObjectSchema as TaskItemWhereUniqueInputObjectSchema } from './TaskItemWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TaskItemCreateWithoutActivitiesInputObjectSchema), z.lazy(() => TaskItemUncheckedCreateWithoutActivitiesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => TaskItemCreateOrConnectWithoutActivitiesInputObjectSchema).optional(),
  connect: z.lazy(() => TaskItemWhereUniqueInputObjectSchema).optional()
}).strict();
export const TaskItemCreateNestedOneWithoutActivitiesInputObjectSchema: z.ZodType<Prisma.TaskItemCreateNestedOneWithoutActivitiesInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemCreateNestedOneWithoutActivitiesInput>;
export const TaskItemCreateNestedOneWithoutActivitiesInputObjectZodSchema = makeSchema();
