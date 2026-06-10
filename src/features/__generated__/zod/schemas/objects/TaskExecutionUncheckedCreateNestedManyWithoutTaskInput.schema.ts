import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskExecutionCreateWithoutTaskInputObjectSchema as TaskExecutionCreateWithoutTaskInputObjectSchema } from './TaskExecutionCreateWithoutTaskInput.schema';
import { TaskExecutionUncheckedCreateWithoutTaskInputObjectSchema as TaskExecutionUncheckedCreateWithoutTaskInputObjectSchema } from './TaskExecutionUncheckedCreateWithoutTaskInput.schema';
import { TaskExecutionCreateOrConnectWithoutTaskInputObjectSchema as TaskExecutionCreateOrConnectWithoutTaskInputObjectSchema } from './TaskExecutionCreateOrConnectWithoutTaskInput.schema';
import { TaskExecutionCreateManyTaskInputEnvelopeObjectSchema as TaskExecutionCreateManyTaskInputEnvelopeObjectSchema } from './TaskExecutionCreateManyTaskInputEnvelope.schema';
import { TaskExecutionWhereUniqueInputObjectSchema as TaskExecutionWhereUniqueInputObjectSchema } from './TaskExecutionWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TaskExecutionCreateWithoutTaskInputObjectSchema), z.lazy(() => TaskExecutionCreateWithoutTaskInputObjectSchema).array(), z.lazy(() => TaskExecutionUncheckedCreateWithoutTaskInputObjectSchema), z.lazy(() => TaskExecutionUncheckedCreateWithoutTaskInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => TaskExecutionCreateOrConnectWithoutTaskInputObjectSchema), z.lazy(() => TaskExecutionCreateOrConnectWithoutTaskInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => TaskExecutionCreateManyTaskInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => TaskExecutionWhereUniqueInputObjectSchema), z.lazy(() => TaskExecutionWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const TaskExecutionUncheckedCreateNestedManyWithoutTaskInputObjectSchema: z.ZodType<Prisma.TaskExecutionUncheckedCreateNestedManyWithoutTaskInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskExecutionUncheckedCreateNestedManyWithoutTaskInput>;
export const TaskExecutionUncheckedCreateNestedManyWithoutTaskInputObjectZodSchema = makeSchema();
