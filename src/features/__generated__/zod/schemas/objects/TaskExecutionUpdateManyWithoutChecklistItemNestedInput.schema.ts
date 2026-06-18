import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskExecutionCreateWithoutChecklistItemInputObjectSchema as TaskExecutionCreateWithoutChecklistItemInputObjectSchema } from './TaskExecutionCreateWithoutChecklistItemInput.schema';
import { TaskExecutionUncheckedCreateWithoutChecklistItemInputObjectSchema as TaskExecutionUncheckedCreateWithoutChecklistItemInputObjectSchema } from './TaskExecutionUncheckedCreateWithoutChecklistItemInput.schema';
import { TaskExecutionCreateOrConnectWithoutChecklistItemInputObjectSchema as TaskExecutionCreateOrConnectWithoutChecklistItemInputObjectSchema } from './TaskExecutionCreateOrConnectWithoutChecklistItemInput.schema';
import { TaskExecutionUpsertWithWhereUniqueWithoutChecklistItemInputObjectSchema as TaskExecutionUpsertWithWhereUniqueWithoutChecklistItemInputObjectSchema } from './TaskExecutionUpsertWithWhereUniqueWithoutChecklistItemInput.schema';
import { TaskExecutionCreateManyChecklistItemInputEnvelopeObjectSchema as TaskExecutionCreateManyChecklistItemInputEnvelopeObjectSchema } from './TaskExecutionCreateManyChecklistItemInputEnvelope.schema';
import { TaskExecutionWhereUniqueInputObjectSchema as TaskExecutionWhereUniqueInputObjectSchema } from './TaskExecutionWhereUniqueInput.schema';
import { TaskExecutionUpdateWithWhereUniqueWithoutChecklistItemInputObjectSchema as TaskExecutionUpdateWithWhereUniqueWithoutChecklistItemInputObjectSchema } from './TaskExecutionUpdateWithWhereUniqueWithoutChecklistItemInput.schema';
import { TaskExecutionUpdateManyWithWhereWithoutChecklistItemInputObjectSchema as TaskExecutionUpdateManyWithWhereWithoutChecklistItemInputObjectSchema } from './TaskExecutionUpdateManyWithWhereWithoutChecklistItemInput.schema';
import { TaskExecutionScalarWhereInputObjectSchema as TaskExecutionScalarWhereInputObjectSchema } from './TaskExecutionScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TaskExecutionCreateWithoutChecklistItemInputObjectSchema), z.lazy(() => TaskExecutionCreateWithoutChecklistItemInputObjectSchema).array(), z.lazy(() => TaskExecutionUncheckedCreateWithoutChecklistItemInputObjectSchema), z.lazy(() => TaskExecutionUncheckedCreateWithoutChecklistItemInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => TaskExecutionCreateOrConnectWithoutChecklistItemInputObjectSchema), z.lazy(() => TaskExecutionCreateOrConnectWithoutChecklistItemInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => TaskExecutionUpsertWithWhereUniqueWithoutChecklistItemInputObjectSchema), z.lazy(() => TaskExecutionUpsertWithWhereUniqueWithoutChecklistItemInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => TaskExecutionCreateManyChecklistItemInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => TaskExecutionWhereUniqueInputObjectSchema), z.lazy(() => TaskExecutionWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => TaskExecutionWhereUniqueInputObjectSchema), z.lazy(() => TaskExecutionWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => TaskExecutionWhereUniqueInputObjectSchema), z.lazy(() => TaskExecutionWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => TaskExecutionWhereUniqueInputObjectSchema), z.lazy(() => TaskExecutionWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => TaskExecutionUpdateWithWhereUniqueWithoutChecklistItemInputObjectSchema), z.lazy(() => TaskExecutionUpdateWithWhereUniqueWithoutChecklistItemInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => TaskExecutionUpdateManyWithWhereWithoutChecklistItemInputObjectSchema), z.lazy(() => TaskExecutionUpdateManyWithWhereWithoutChecklistItemInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => TaskExecutionScalarWhereInputObjectSchema), z.lazy(() => TaskExecutionScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const TaskExecutionUpdateManyWithoutChecklistItemNestedInputObjectSchema: z.ZodType<Prisma.TaskExecutionUpdateManyWithoutChecklistItemNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskExecutionUpdateManyWithoutChecklistItemNestedInput>;
export const TaskExecutionUpdateManyWithoutChecklistItemNestedInputObjectZodSchema = makeSchema();
