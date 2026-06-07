import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskWhereUniqueInputObjectSchema as TaskWhereUniqueInputObjectSchema } from './TaskWhereUniqueInput.schema';
import { TaskUpdateWithoutAcquisitionInputObjectSchema as TaskUpdateWithoutAcquisitionInputObjectSchema } from './TaskUpdateWithoutAcquisitionInput.schema';
import { TaskUncheckedUpdateWithoutAcquisitionInputObjectSchema as TaskUncheckedUpdateWithoutAcquisitionInputObjectSchema } from './TaskUncheckedUpdateWithoutAcquisitionInput.schema';
import { TaskCreateWithoutAcquisitionInputObjectSchema as TaskCreateWithoutAcquisitionInputObjectSchema } from './TaskCreateWithoutAcquisitionInput.schema';
import { TaskUncheckedCreateWithoutAcquisitionInputObjectSchema as TaskUncheckedCreateWithoutAcquisitionInputObjectSchema } from './TaskUncheckedCreateWithoutAcquisitionInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => TaskUpdateWithoutAcquisitionInputObjectSchema), z.lazy(() => TaskUncheckedUpdateWithoutAcquisitionInputObjectSchema)]),
  create: z.union([z.lazy(() => TaskCreateWithoutAcquisitionInputObjectSchema), z.lazy(() => TaskUncheckedCreateWithoutAcquisitionInputObjectSchema)])
}).strict();
export const TaskUpsertWithWhereUniqueWithoutAcquisitionInputObjectSchema: z.ZodType<Prisma.TaskUpsertWithWhereUniqueWithoutAcquisitionInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskUpsertWithWhereUniqueWithoutAcquisitionInput>;
export const TaskUpsertWithWhereUniqueWithoutAcquisitionInputObjectZodSchema = makeSchema();
