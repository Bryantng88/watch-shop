import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskWhereUniqueInputObjectSchema as TaskWhereUniqueInputObjectSchema } from './TaskWhereUniqueInput.schema';
import { TaskCreateWithoutWorkCaseInputObjectSchema as TaskCreateWithoutWorkCaseInputObjectSchema } from './TaskCreateWithoutWorkCaseInput.schema';
import { TaskUncheckedCreateWithoutWorkCaseInputObjectSchema as TaskUncheckedCreateWithoutWorkCaseInputObjectSchema } from './TaskUncheckedCreateWithoutWorkCaseInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => TaskCreateWithoutWorkCaseInputObjectSchema), z.lazy(() => TaskUncheckedCreateWithoutWorkCaseInputObjectSchema)])
}).strict();
export const TaskCreateOrConnectWithoutWorkCaseInputObjectSchema: z.ZodType<Prisma.TaskCreateOrConnectWithoutWorkCaseInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskCreateOrConnectWithoutWorkCaseInput>;
export const TaskCreateOrConnectWithoutWorkCaseInputObjectZodSchema = makeSchema();
