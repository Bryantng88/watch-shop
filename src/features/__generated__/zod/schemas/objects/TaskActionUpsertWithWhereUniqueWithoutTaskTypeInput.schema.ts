import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskActionWhereUniqueInputObjectSchema as TaskActionWhereUniqueInputObjectSchema } from './TaskActionWhereUniqueInput.schema';
import { TaskActionUpdateWithoutTaskTypeInputObjectSchema as TaskActionUpdateWithoutTaskTypeInputObjectSchema } from './TaskActionUpdateWithoutTaskTypeInput.schema';
import { TaskActionUncheckedUpdateWithoutTaskTypeInputObjectSchema as TaskActionUncheckedUpdateWithoutTaskTypeInputObjectSchema } from './TaskActionUncheckedUpdateWithoutTaskTypeInput.schema';
import { TaskActionCreateWithoutTaskTypeInputObjectSchema as TaskActionCreateWithoutTaskTypeInputObjectSchema } from './TaskActionCreateWithoutTaskTypeInput.schema';
import { TaskActionUncheckedCreateWithoutTaskTypeInputObjectSchema as TaskActionUncheckedCreateWithoutTaskTypeInputObjectSchema } from './TaskActionUncheckedCreateWithoutTaskTypeInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskActionWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => TaskActionUpdateWithoutTaskTypeInputObjectSchema), z.lazy(() => TaskActionUncheckedUpdateWithoutTaskTypeInputObjectSchema)]),
  create: z.union([z.lazy(() => TaskActionCreateWithoutTaskTypeInputObjectSchema), z.lazy(() => TaskActionUncheckedCreateWithoutTaskTypeInputObjectSchema)])
}).strict();
export const TaskActionUpsertWithWhereUniqueWithoutTaskTypeInputObjectSchema: z.ZodType<Prisma.TaskActionUpsertWithWhereUniqueWithoutTaskTypeInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskActionUpsertWithWhereUniqueWithoutTaskTypeInput>;
export const TaskActionUpsertWithWhereUniqueWithoutTaskTypeInputObjectZodSchema = makeSchema();
