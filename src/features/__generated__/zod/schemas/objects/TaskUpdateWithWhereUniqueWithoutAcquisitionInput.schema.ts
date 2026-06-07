import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskWhereUniqueInputObjectSchema as TaskWhereUniqueInputObjectSchema } from './TaskWhereUniqueInput.schema';
import { TaskUpdateWithoutAcquisitionInputObjectSchema as TaskUpdateWithoutAcquisitionInputObjectSchema } from './TaskUpdateWithoutAcquisitionInput.schema';
import { TaskUncheckedUpdateWithoutAcquisitionInputObjectSchema as TaskUncheckedUpdateWithoutAcquisitionInputObjectSchema } from './TaskUncheckedUpdateWithoutAcquisitionInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => TaskUpdateWithoutAcquisitionInputObjectSchema), z.lazy(() => TaskUncheckedUpdateWithoutAcquisitionInputObjectSchema)])
}).strict();
export const TaskUpdateWithWhereUniqueWithoutAcquisitionInputObjectSchema: z.ZodType<Prisma.TaskUpdateWithWhereUniqueWithoutAcquisitionInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskUpdateWithWhereUniqueWithoutAcquisitionInput>;
export const TaskUpdateWithWhereUniqueWithoutAcquisitionInputObjectZodSchema = makeSchema();
