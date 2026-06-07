import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskCreateWithoutPaymentInputObjectSchema as TaskCreateWithoutPaymentInputObjectSchema } from './TaskCreateWithoutPaymentInput.schema';
import { TaskUncheckedCreateWithoutPaymentInputObjectSchema as TaskUncheckedCreateWithoutPaymentInputObjectSchema } from './TaskUncheckedCreateWithoutPaymentInput.schema';
import { TaskCreateOrConnectWithoutPaymentInputObjectSchema as TaskCreateOrConnectWithoutPaymentInputObjectSchema } from './TaskCreateOrConnectWithoutPaymentInput.schema';
import { TaskUpsertWithWhereUniqueWithoutPaymentInputObjectSchema as TaskUpsertWithWhereUniqueWithoutPaymentInputObjectSchema } from './TaskUpsertWithWhereUniqueWithoutPaymentInput.schema';
import { TaskCreateManyPaymentInputEnvelopeObjectSchema as TaskCreateManyPaymentInputEnvelopeObjectSchema } from './TaskCreateManyPaymentInputEnvelope.schema';
import { TaskWhereUniqueInputObjectSchema as TaskWhereUniqueInputObjectSchema } from './TaskWhereUniqueInput.schema';
import { TaskUpdateWithWhereUniqueWithoutPaymentInputObjectSchema as TaskUpdateWithWhereUniqueWithoutPaymentInputObjectSchema } from './TaskUpdateWithWhereUniqueWithoutPaymentInput.schema';
import { TaskUpdateManyWithWhereWithoutPaymentInputObjectSchema as TaskUpdateManyWithWhereWithoutPaymentInputObjectSchema } from './TaskUpdateManyWithWhereWithoutPaymentInput.schema';
import { TaskScalarWhereInputObjectSchema as TaskScalarWhereInputObjectSchema } from './TaskScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TaskCreateWithoutPaymentInputObjectSchema), z.lazy(() => TaskCreateWithoutPaymentInputObjectSchema).array(), z.lazy(() => TaskUncheckedCreateWithoutPaymentInputObjectSchema), z.lazy(() => TaskUncheckedCreateWithoutPaymentInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => TaskCreateOrConnectWithoutPaymentInputObjectSchema), z.lazy(() => TaskCreateOrConnectWithoutPaymentInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => TaskUpsertWithWhereUniqueWithoutPaymentInputObjectSchema), z.lazy(() => TaskUpsertWithWhereUniqueWithoutPaymentInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => TaskCreateManyPaymentInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => TaskWhereUniqueInputObjectSchema), z.lazy(() => TaskWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => TaskWhereUniqueInputObjectSchema), z.lazy(() => TaskWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => TaskWhereUniqueInputObjectSchema), z.lazy(() => TaskWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => TaskWhereUniqueInputObjectSchema), z.lazy(() => TaskWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => TaskUpdateWithWhereUniqueWithoutPaymentInputObjectSchema), z.lazy(() => TaskUpdateWithWhereUniqueWithoutPaymentInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => TaskUpdateManyWithWhereWithoutPaymentInputObjectSchema), z.lazy(() => TaskUpdateManyWithWhereWithoutPaymentInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => TaskScalarWhereInputObjectSchema), z.lazy(() => TaskScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const TaskUpdateManyWithoutPaymentNestedInputObjectSchema: z.ZodType<Prisma.TaskUpdateManyWithoutPaymentNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskUpdateManyWithoutPaymentNestedInput>;
export const TaskUpdateManyWithoutPaymentNestedInputObjectZodSchema = makeSchema();
