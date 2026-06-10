import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskWhereUniqueInputObjectSchema as TaskWhereUniqueInputObjectSchema } from './TaskWhereUniqueInput.schema';
import { TaskUpdateWithoutWorkCaseInputObjectSchema as TaskUpdateWithoutWorkCaseInputObjectSchema } from './TaskUpdateWithoutWorkCaseInput.schema';
import { TaskUncheckedUpdateWithoutWorkCaseInputObjectSchema as TaskUncheckedUpdateWithoutWorkCaseInputObjectSchema } from './TaskUncheckedUpdateWithoutWorkCaseInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => TaskUpdateWithoutWorkCaseInputObjectSchema), z.lazy(() => TaskUncheckedUpdateWithoutWorkCaseInputObjectSchema)])
}).strict();
export const TaskUpdateWithWhereUniqueWithoutWorkCaseInputObjectSchema: z.ZodType<Prisma.TaskUpdateWithWhereUniqueWithoutWorkCaseInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskUpdateWithWhereUniqueWithoutWorkCaseInput>;
export const TaskUpdateWithWhereUniqueWithoutWorkCaseInputObjectZodSchema = makeSchema();
