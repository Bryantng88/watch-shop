import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskExecutionCreateWithoutTaskInputObjectSchema as TaskExecutionCreateWithoutTaskInputObjectSchema } from './TaskExecutionCreateWithoutTaskInput.schema';
import { TaskExecutionUncheckedCreateWithoutTaskInputObjectSchema as TaskExecutionUncheckedCreateWithoutTaskInputObjectSchema } from './TaskExecutionUncheckedCreateWithoutTaskInput.schema';
import { TaskExecutionCreateOrConnectWithoutTaskInputObjectSchema as TaskExecutionCreateOrConnectWithoutTaskInputObjectSchema } from './TaskExecutionCreateOrConnectWithoutTaskInput.schema';
import { TaskExecutionUpsertWithWhereUniqueWithoutTaskInputObjectSchema as TaskExecutionUpsertWithWhereUniqueWithoutTaskInputObjectSchema } from './TaskExecutionUpsertWithWhereUniqueWithoutTaskInput.schema';
import { TaskExecutionCreateManyTaskInputEnvelopeObjectSchema as TaskExecutionCreateManyTaskInputEnvelopeObjectSchema } from './TaskExecutionCreateManyTaskInputEnvelope.schema';
import { TaskExecutionWhereUniqueInputObjectSchema as TaskExecutionWhereUniqueInputObjectSchema } from './TaskExecutionWhereUniqueInput.schema';
import { TaskExecutionUpdateWithWhereUniqueWithoutTaskInputObjectSchema as TaskExecutionUpdateWithWhereUniqueWithoutTaskInputObjectSchema } from './TaskExecutionUpdateWithWhereUniqueWithoutTaskInput.schema';
import { TaskExecutionUpdateManyWithWhereWithoutTaskInputObjectSchema as TaskExecutionUpdateManyWithWhereWithoutTaskInputObjectSchema } from './TaskExecutionUpdateManyWithWhereWithoutTaskInput.schema';
import { TaskExecutionScalarWhereInputObjectSchema as TaskExecutionScalarWhereInputObjectSchema } from './TaskExecutionScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TaskExecutionCreateWithoutTaskInputObjectSchema), z.lazy(() => TaskExecutionCreateWithoutTaskInputObjectSchema).array(), z.lazy(() => TaskExecutionUncheckedCreateWithoutTaskInputObjectSchema), z.lazy(() => TaskExecutionUncheckedCreateWithoutTaskInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => TaskExecutionCreateOrConnectWithoutTaskInputObjectSchema), z.lazy(() => TaskExecutionCreateOrConnectWithoutTaskInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => TaskExecutionUpsertWithWhereUniqueWithoutTaskInputObjectSchema), z.lazy(() => TaskExecutionUpsertWithWhereUniqueWithoutTaskInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => TaskExecutionCreateManyTaskInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => TaskExecutionWhereUniqueInputObjectSchema), z.lazy(() => TaskExecutionWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => TaskExecutionWhereUniqueInputObjectSchema), z.lazy(() => TaskExecutionWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => TaskExecutionWhereUniqueInputObjectSchema), z.lazy(() => TaskExecutionWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => TaskExecutionWhereUniqueInputObjectSchema), z.lazy(() => TaskExecutionWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => TaskExecutionUpdateWithWhereUniqueWithoutTaskInputObjectSchema), z.lazy(() => TaskExecutionUpdateWithWhereUniqueWithoutTaskInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => TaskExecutionUpdateManyWithWhereWithoutTaskInputObjectSchema), z.lazy(() => TaskExecutionUpdateManyWithWhereWithoutTaskInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => TaskExecutionScalarWhereInputObjectSchema), z.lazy(() => TaskExecutionScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const TaskExecutionUpdateManyWithoutTaskNestedInputObjectSchema: z.ZodType<Prisma.TaskExecutionUpdateManyWithoutTaskNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskExecutionUpdateManyWithoutTaskNestedInput>;
export const TaskExecutionUpdateManyWithoutTaskNestedInputObjectZodSchema = makeSchema();
