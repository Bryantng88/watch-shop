import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskWhereUniqueInputObjectSchema as TaskWhereUniqueInputObjectSchema } from './TaskWhereUniqueInput.schema';
import { TaskCreateWithoutAcquisitionInputObjectSchema as TaskCreateWithoutAcquisitionInputObjectSchema } from './TaskCreateWithoutAcquisitionInput.schema';
import { TaskUncheckedCreateWithoutAcquisitionInputObjectSchema as TaskUncheckedCreateWithoutAcquisitionInputObjectSchema } from './TaskUncheckedCreateWithoutAcquisitionInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => TaskCreateWithoutAcquisitionInputObjectSchema), z.lazy(() => TaskUncheckedCreateWithoutAcquisitionInputObjectSchema)])
}).strict();
export const TaskCreateOrConnectWithoutAcquisitionInputObjectSchema: z.ZodType<Prisma.TaskCreateOrConnectWithoutAcquisitionInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskCreateOrConnectWithoutAcquisitionInput>;
export const TaskCreateOrConnectWithoutAcquisitionInputObjectZodSchema = makeSchema();
