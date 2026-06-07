import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskWhereUniqueInputObjectSchema as TaskWhereUniqueInputObjectSchema } from './TaskWhereUniqueInput.schema';
import { TaskCreateWithoutCreatedByUserInputObjectSchema as TaskCreateWithoutCreatedByUserInputObjectSchema } from './TaskCreateWithoutCreatedByUserInput.schema';
import { TaskUncheckedCreateWithoutCreatedByUserInputObjectSchema as TaskUncheckedCreateWithoutCreatedByUserInputObjectSchema } from './TaskUncheckedCreateWithoutCreatedByUserInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => TaskCreateWithoutCreatedByUserInputObjectSchema), z.lazy(() => TaskUncheckedCreateWithoutCreatedByUserInputObjectSchema)])
}).strict();
export const TaskCreateOrConnectWithoutCreatedByUserInputObjectSchema: z.ZodType<Prisma.TaskCreateOrConnectWithoutCreatedByUserInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskCreateOrConnectWithoutCreatedByUserInput>;
export const TaskCreateOrConnectWithoutCreatedByUserInputObjectZodSchema = makeSchema();
