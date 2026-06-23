import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskExecutionCreateWithoutTaskItemInputObjectSchema as TaskExecutionCreateWithoutTaskItemInputObjectSchema } from './TaskExecutionCreateWithoutTaskItemInput.schema';
import { TaskExecutionUncheckedCreateWithoutTaskItemInputObjectSchema as TaskExecutionUncheckedCreateWithoutTaskItemInputObjectSchema } from './TaskExecutionUncheckedCreateWithoutTaskItemInput.schema';
import { TaskExecutionCreateOrConnectWithoutTaskItemInputObjectSchema as TaskExecutionCreateOrConnectWithoutTaskItemInputObjectSchema } from './TaskExecutionCreateOrConnectWithoutTaskItemInput.schema';
import { TaskExecutionCreateManyTaskItemInputEnvelopeObjectSchema as TaskExecutionCreateManyTaskItemInputEnvelopeObjectSchema } from './TaskExecutionCreateManyTaskItemInputEnvelope.schema';
import { TaskExecutionWhereUniqueInputObjectSchema as TaskExecutionWhereUniqueInputObjectSchema } from './TaskExecutionWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TaskExecutionCreateWithoutTaskItemInputObjectSchema), z.lazy(() => TaskExecutionCreateWithoutTaskItemInputObjectSchema).array(), z.lazy(() => TaskExecutionUncheckedCreateWithoutTaskItemInputObjectSchema), z.lazy(() => TaskExecutionUncheckedCreateWithoutTaskItemInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => TaskExecutionCreateOrConnectWithoutTaskItemInputObjectSchema), z.lazy(() => TaskExecutionCreateOrConnectWithoutTaskItemInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => TaskExecutionCreateManyTaskItemInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => TaskExecutionWhereUniqueInputObjectSchema), z.lazy(() => TaskExecutionWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const TaskExecutionCreateNestedManyWithoutTaskItemInputObjectSchema: z.ZodType<Prisma.TaskExecutionCreateNestedManyWithoutTaskItemInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskExecutionCreateNestedManyWithoutTaskItemInput>;
export const TaskExecutionCreateNestedManyWithoutTaskItemInputObjectZodSchema = makeSchema();
