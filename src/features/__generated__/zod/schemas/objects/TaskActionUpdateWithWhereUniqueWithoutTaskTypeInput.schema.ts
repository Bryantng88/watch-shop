import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskActionWhereUniqueInputObjectSchema as TaskActionWhereUniqueInputObjectSchema } from './TaskActionWhereUniqueInput.schema';
import { TaskActionUpdateWithoutTaskTypeInputObjectSchema as TaskActionUpdateWithoutTaskTypeInputObjectSchema } from './TaskActionUpdateWithoutTaskTypeInput.schema';
import { TaskActionUncheckedUpdateWithoutTaskTypeInputObjectSchema as TaskActionUncheckedUpdateWithoutTaskTypeInputObjectSchema } from './TaskActionUncheckedUpdateWithoutTaskTypeInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskActionWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => TaskActionUpdateWithoutTaskTypeInputObjectSchema), z.lazy(() => TaskActionUncheckedUpdateWithoutTaskTypeInputObjectSchema)])
}).strict();
export const TaskActionUpdateWithWhereUniqueWithoutTaskTypeInputObjectSchema: z.ZodType<Prisma.TaskActionUpdateWithWhereUniqueWithoutTaskTypeInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskActionUpdateWithWhereUniqueWithoutTaskTypeInput>;
export const TaskActionUpdateWithWhereUniqueWithoutTaskTypeInputObjectZodSchema = makeSchema();
