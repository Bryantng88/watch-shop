import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskWhereUniqueInputObjectSchema as TaskWhereUniqueInputObjectSchema } from './TaskWhereUniqueInput.schema';
import { TaskUpdateWithoutOrderInputObjectSchema as TaskUpdateWithoutOrderInputObjectSchema } from './TaskUpdateWithoutOrderInput.schema';
import { TaskUncheckedUpdateWithoutOrderInputObjectSchema as TaskUncheckedUpdateWithoutOrderInputObjectSchema } from './TaskUncheckedUpdateWithoutOrderInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => TaskUpdateWithoutOrderInputObjectSchema), z.lazy(() => TaskUncheckedUpdateWithoutOrderInputObjectSchema)])
}).strict();
export const TaskUpdateWithWhereUniqueWithoutOrderInputObjectSchema: z.ZodType<Prisma.TaskUpdateWithWhereUniqueWithoutOrderInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskUpdateWithWhereUniqueWithoutOrderInput>;
export const TaskUpdateWithWhereUniqueWithoutOrderInputObjectZodSchema = makeSchema();
