import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskItemCreateWithoutActivitiesInputObjectSchema as TaskItemCreateWithoutActivitiesInputObjectSchema } from './TaskItemCreateWithoutActivitiesInput.schema';
import { TaskItemUncheckedCreateWithoutActivitiesInputObjectSchema as TaskItemUncheckedCreateWithoutActivitiesInputObjectSchema } from './TaskItemUncheckedCreateWithoutActivitiesInput.schema';
import { TaskItemCreateOrConnectWithoutActivitiesInputObjectSchema as TaskItemCreateOrConnectWithoutActivitiesInputObjectSchema } from './TaskItemCreateOrConnectWithoutActivitiesInput.schema';
import { TaskItemUpsertWithoutActivitiesInputObjectSchema as TaskItemUpsertWithoutActivitiesInputObjectSchema } from './TaskItemUpsertWithoutActivitiesInput.schema';
import { TaskItemWhereUniqueInputObjectSchema as TaskItemWhereUniqueInputObjectSchema } from './TaskItemWhereUniqueInput.schema';
import { TaskItemUpdateToOneWithWhereWithoutActivitiesInputObjectSchema as TaskItemUpdateToOneWithWhereWithoutActivitiesInputObjectSchema } from './TaskItemUpdateToOneWithWhereWithoutActivitiesInput.schema';
import { TaskItemUpdateWithoutActivitiesInputObjectSchema as TaskItemUpdateWithoutActivitiesInputObjectSchema } from './TaskItemUpdateWithoutActivitiesInput.schema';
import { TaskItemUncheckedUpdateWithoutActivitiesInputObjectSchema as TaskItemUncheckedUpdateWithoutActivitiesInputObjectSchema } from './TaskItemUncheckedUpdateWithoutActivitiesInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TaskItemCreateWithoutActivitiesInputObjectSchema), z.lazy(() => TaskItemUncheckedCreateWithoutActivitiesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => TaskItemCreateOrConnectWithoutActivitiesInputObjectSchema).optional(),
  upsert: z.lazy(() => TaskItemUpsertWithoutActivitiesInputObjectSchema).optional(),
  connect: z.lazy(() => TaskItemWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => TaskItemUpdateToOneWithWhereWithoutActivitiesInputObjectSchema), z.lazy(() => TaskItemUpdateWithoutActivitiesInputObjectSchema), z.lazy(() => TaskItemUncheckedUpdateWithoutActivitiesInputObjectSchema)]).optional()
}).strict();
export const TaskItemUpdateOneRequiredWithoutActivitiesNestedInputObjectSchema: z.ZodType<Prisma.TaskItemUpdateOneRequiredWithoutActivitiesNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemUpdateOneRequiredWithoutActivitiesNestedInput>;
export const TaskItemUpdateOneRequiredWithoutActivitiesNestedInputObjectZodSchema = makeSchema();
