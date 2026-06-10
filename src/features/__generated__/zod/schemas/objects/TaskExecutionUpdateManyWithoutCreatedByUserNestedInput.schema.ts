import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskExecutionCreateWithoutCreatedByUserInputObjectSchema as TaskExecutionCreateWithoutCreatedByUserInputObjectSchema } from './TaskExecutionCreateWithoutCreatedByUserInput.schema';
import { TaskExecutionUncheckedCreateWithoutCreatedByUserInputObjectSchema as TaskExecutionUncheckedCreateWithoutCreatedByUserInputObjectSchema } from './TaskExecutionUncheckedCreateWithoutCreatedByUserInput.schema';
import { TaskExecutionCreateOrConnectWithoutCreatedByUserInputObjectSchema as TaskExecutionCreateOrConnectWithoutCreatedByUserInputObjectSchema } from './TaskExecutionCreateOrConnectWithoutCreatedByUserInput.schema';
import { TaskExecutionUpsertWithWhereUniqueWithoutCreatedByUserInputObjectSchema as TaskExecutionUpsertWithWhereUniqueWithoutCreatedByUserInputObjectSchema } from './TaskExecutionUpsertWithWhereUniqueWithoutCreatedByUserInput.schema';
import { TaskExecutionCreateManyCreatedByUserInputEnvelopeObjectSchema as TaskExecutionCreateManyCreatedByUserInputEnvelopeObjectSchema } from './TaskExecutionCreateManyCreatedByUserInputEnvelope.schema';
import { TaskExecutionWhereUniqueInputObjectSchema as TaskExecutionWhereUniqueInputObjectSchema } from './TaskExecutionWhereUniqueInput.schema';
import { TaskExecutionUpdateWithWhereUniqueWithoutCreatedByUserInputObjectSchema as TaskExecutionUpdateWithWhereUniqueWithoutCreatedByUserInputObjectSchema } from './TaskExecutionUpdateWithWhereUniqueWithoutCreatedByUserInput.schema';
import { TaskExecutionUpdateManyWithWhereWithoutCreatedByUserInputObjectSchema as TaskExecutionUpdateManyWithWhereWithoutCreatedByUserInputObjectSchema } from './TaskExecutionUpdateManyWithWhereWithoutCreatedByUserInput.schema';
import { TaskExecutionScalarWhereInputObjectSchema as TaskExecutionScalarWhereInputObjectSchema } from './TaskExecutionScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TaskExecutionCreateWithoutCreatedByUserInputObjectSchema), z.lazy(() => TaskExecutionCreateWithoutCreatedByUserInputObjectSchema).array(), z.lazy(() => TaskExecutionUncheckedCreateWithoutCreatedByUserInputObjectSchema), z.lazy(() => TaskExecutionUncheckedCreateWithoutCreatedByUserInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => TaskExecutionCreateOrConnectWithoutCreatedByUserInputObjectSchema), z.lazy(() => TaskExecutionCreateOrConnectWithoutCreatedByUserInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => TaskExecutionUpsertWithWhereUniqueWithoutCreatedByUserInputObjectSchema), z.lazy(() => TaskExecutionUpsertWithWhereUniqueWithoutCreatedByUserInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => TaskExecutionCreateManyCreatedByUserInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => TaskExecutionWhereUniqueInputObjectSchema), z.lazy(() => TaskExecutionWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => TaskExecutionWhereUniqueInputObjectSchema), z.lazy(() => TaskExecutionWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => TaskExecutionWhereUniqueInputObjectSchema), z.lazy(() => TaskExecutionWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => TaskExecutionWhereUniqueInputObjectSchema), z.lazy(() => TaskExecutionWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => TaskExecutionUpdateWithWhereUniqueWithoutCreatedByUserInputObjectSchema), z.lazy(() => TaskExecutionUpdateWithWhereUniqueWithoutCreatedByUserInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => TaskExecutionUpdateManyWithWhereWithoutCreatedByUserInputObjectSchema), z.lazy(() => TaskExecutionUpdateManyWithWhereWithoutCreatedByUserInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => TaskExecutionScalarWhereInputObjectSchema), z.lazy(() => TaskExecutionScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const TaskExecutionUpdateManyWithoutCreatedByUserNestedInputObjectSchema: z.ZodType<Prisma.TaskExecutionUpdateManyWithoutCreatedByUserNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskExecutionUpdateManyWithoutCreatedByUserNestedInput>;
export const TaskExecutionUpdateManyWithoutCreatedByUserNestedInputObjectZodSchema = makeSchema();
