import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskWhereUniqueInputObjectSchema as TaskWhereUniqueInputObjectSchema } from './TaskWhereUniqueInput.schema';
import { TaskUpdateWithoutWorkCaseInputObjectSchema as TaskUpdateWithoutWorkCaseInputObjectSchema } from './TaskUpdateWithoutWorkCaseInput.schema';
import { TaskUncheckedUpdateWithoutWorkCaseInputObjectSchema as TaskUncheckedUpdateWithoutWorkCaseInputObjectSchema } from './TaskUncheckedUpdateWithoutWorkCaseInput.schema';
import { TaskCreateWithoutWorkCaseInputObjectSchema as TaskCreateWithoutWorkCaseInputObjectSchema } from './TaskCreateWithoutWorkCaseInput.schema';
import { TaskUncheckedCreateWithoutWorkCaseInputObjectSchema as TaskUncheckedCreateWithoutWorkCaseInputObjectSchema } from './TaskUncheckedCreateWithoutWorkCaseInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => TaskUpdateWithoutWorkCaseInputObjectSchema), z.lazy(() => TaskUncheckedUpdateWithoutWorkCaseInputObjectSchema)]),
  create: z.union([z.lazy(() => TaskCreateWithoutWorkCaseInputObjectSchema), z.lazy(() => TaskUncheckedCreateWithoutWorkCaseInputObjectSchema)])
}).strict();
export const TaskUpsertWithWhereUniqueWithoutWorkCaseInputObjectSchema: z.ZodType<Prisma.TaskUpsertWithWhereUniqueWithoutWorkCaseInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskUpsertWithWhereUniqueWithoutWorkCaseInput>;
export const TaskUpsertWithWhereUniqueWithoutWorkCaseInputObjectZodSchema = makeSchema();
