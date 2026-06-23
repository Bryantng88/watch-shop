import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskExecutionCreateWithoutTaskItemInputObjectSchema as TaskExecutionCreateWithoutTaskItemInputObjectSchema } from './TaskExecutionCreateWithoutTaskItemInput.schema';
import { TaskExecutionUncheckedCreateWithoutTaskItemInputObjectSchema as TaskExecutionUncheckedCreateWithoutTaskItemInputObjectSchema } from './TaskExecutionUncheckedCreateWithoutTaskItemInput.schema';
import { TaskExecutionCreateOrConnectWithoutTaskItemInputObjectSchema as TaskExecutionCreateOrConnectWithoutTaskItemInputObjectSchema } from './TaskExecutionCreateOrConnectWithoutTaskItemInput.schema';
import { TaskExecutionUpsertWithWhereUniqueWithoutTaskItemInputObjectSchema as TaskExecutionUpsertWithWhereUniqueWithoutTaskItemInputObjectSchema } from './TaskExecutionUpsertWithWhereUniqueWithoutTaskItemInput.schema';
import { TaskExecutionCreateManyTaskItemInputEnvelopeObjectSchema as TaskExecutionCreateManyTaskItemInputEnvelopeObjectSchema } from './TaskExecutionCreateManyTaskItemInputEnvelope.schema';
import { TaskExecutionWhereUniqueInputObjectSchema as TaskExecutionWhereUniqueInputObjectSchema } from './TaskExecutionWhereUniqueInput.schema';
import { TaskExecutionUpdateWithWhereUniqueWithoutTaskItemInputObjectSchema as TaskExecutionUpdateWithWhereUniqueWithoutTaskItemInputObjectSchema } from './TaskExecutionUpdateWithWhereUniqueWithoutTaskItemInput.schema';
import { TaskExecutionUpdateManyWithWhereWithoutTaskItemInputObjectSchema as TaskExecutionUpdateManyWithWhereWithoutTaskItemInputObjectSchema } from './TaskExecutionUpdateManyWithWhereWithoutTaskItemInput.schema';
import { TaskExecutionScalarWhereInputObjectSchema as TaskExecutionScalarWhereInputObjectSchema } from './TaskExecutionScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TaskExecutionCreateWithoutTaskItemInputObjectSchema), z.lazy(() => TaskExecutionCreateWithoutTaskItemInputObjectSchema).array(), z.lazy(() => TaskExecutionUncheckedCreateWithoutTaskItemInputObjectSchema), z.lazy(() => TaskExecutionUncheckedCreateWithoutTaskItemInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => TaskExecutionCreateOrConnectWithoutTaskItemInputObjectSchema), z.lazy(() => TaskExecutionCreateOrConnectWithoutTaskItemInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => TaskExecutionUpsertWithWhereUniqueWithoutTaskItemInputObjectSchema), z.lazy(() => TaskExecutionUpsertWithWhereUniqueWithoutTaskItemInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => TaskExecutionCreateManyTaskItemInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => TaskExecutionWhereUniqueInputObjectSchema), z.lazy(() => TaskExecutionWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => TaskExecutionWhereUniqueInputObjectSchema), z.lazy(() => TaskExecutionWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => TaskExecutionWhereUniqueInputObjectSchema), z.lazy(() => TaskExecutionWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => TaskExecutionWhereUniqueInputObjectSchema), z.lazy(() => TaskExecutionWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => TaskExecutionUpdateWithWhereUniqueWithoutTaskItemInputObjectSchema), z.lazy(() => TaskExecutionUpdateWithWhereUniqueWithoutTaskItemInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => TaskExecutionUpdateManyWithWhereWithoutTaskItemInputObjectSchema), z.lazy(() => TaskExecutionUpdateManyWithWhereWithoutTaskItemInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => TaskExecutionScalarWhereInputObjectSchema), z.lazy(() => TaskExecutionScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const TaskExecutionUncheckedUpdateManyWithoutTaskItemNestedInputObjectSchema: z.ZodType<Prisma.TaskExecutionUncheckedUpdateManyWithoutTaskItemNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskExecutionUncheckedUpdateManyWithoutTaskItemNestedInput>;
export const TaskExecutionUncheckedUpdateManyWithoutTaskItemNestedInputObjectZodSchema = makeSchema();
