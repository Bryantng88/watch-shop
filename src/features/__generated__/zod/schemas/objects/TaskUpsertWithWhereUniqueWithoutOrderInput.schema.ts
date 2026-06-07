import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskWhereUniqueInputObjectSchema as TaskWhereUniqueInputObjectSchema } from './TaskWhereUniqueInput.schema';
import { TaskUpdateWithoutOrderInputObjectSchema as TaskUpdateWithoutOrderInputObjectSchema } from './TaskUpdateWithoutOrderInput.schema';
import { TaskUncheckedUpdateWithoutOrderInputObjectSchema as TaskUncheckedUpdateWithoutOrderInputObjectSchema } from './TaskUncheckedUpdateWithoutOrderInput.schema';
import { TaskCreateWithoutOrderInputObjectSchema as TaskCreateWithoutOrderInputObjectSchema } from './TaskCreateWithoutOrderInput.schema';
import { TaskUncheckedCreateWithoutOrderInputObjectSchema as TaskUncheckedCreateWithoutOrderInputObjectSchema } from './TaskUncheckedCreateWithoutOrderInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => TaskUpdateWithoutOrderInputObjectSchema), z.lazy(() => TaskUncheckedUpdateWithoutOrderInputObjectSchema)]),
  create: z.union([z.lazy(() => TaskCreateWithoutOrderInputObjectSchema), z.lazy(() => TaskUncheckedCreateWithoutOrderInputObjectSchema)])
}).strict();
export const TaskUpsertWithWhereUniqueWithoutOrderInputObjectSchema: z.ZodType<Prisma.TaskUpsertWithWhereUniqueWithoutOrderInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskUpsertWithWhereUniqueWithoutOrderInput>;
export const TaskUpsertWithWhereUniqueWithoutOrderInputObjectZodSchema = makeSchema();
