import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskWhereUniqueInputObjectSchema as TaskWhereUniqueInputObjectSchema } from './TaskWhereUniqueInput.schema';
import { TaskCreateWithoutCancelledByUserInputObjectSchema as TaskCreateWithoutCancelledByUserInputObjectSchema } from './TaskCreateWithoutCancelledByUserInput.schema';
import { TaskUncheckedCreateWithoutCancelledByUserInputObjectSchema as TaskUncheckedCreateWithoutCancelledByUserInputObjectSchema } from './TaskUncheckedCreateWithoutCancelledByUserInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => TaskCreateWithoutCancelledByUserInputObjectSchema), z.lazy(() => TaskUncheckedCreateWithoutCancelledByUserInputObjectSchema)])
}).strict();
export const TaskCreateOrConnectWithoutCancelledByUserInputObjectSchema: z.ZodType<Prisma.TaskCreateOrConnectWithoutCancelledByUserInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskCreateOrConnectWithoutCancelledByUserInput>;
export const TaskCreateOrConnectWithoutCancelledByUserInputObjectZodSchema = makeSchema();
