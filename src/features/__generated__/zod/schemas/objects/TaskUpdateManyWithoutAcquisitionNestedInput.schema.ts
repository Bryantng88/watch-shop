import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskCreateWithoutAcquisitionInputObjectSchema as TaskCreateWithoutAcquisitionInputObjectSchema } from './TaskCreateWithoutAcquisitionInput.schema';
import { TaskUncheckedCreateWithoutAcquisitionInputObjectSchema as TaskUncheckedCreateWithoutAcquisitionInputObjectSchema } from './TaskUncheckedCreateWithoutAcquisitionInput.schema';
import { TaskCreateOrConnectWithoutAcquisitionInputObjectSchema as TaskCreateOrConnectWithoutAcquisitionInputObjectSchema } from './TaskCreateOrConnectWithoutAcquisitionInput.schema';
import { TaskUpsertWithWhereUniqueWithoutAcquisitionInputObjectSchema as TaskUpsertWithWhereUniqueWithoutAcquisitionInputObjectSchema } from './TaskUpsertWithWhereUniqueWithoutAcquisitionInput.schema';
import { TaskCreateManyAcquisitionInputEnvelopeObjectSchema as TaskCreateManyAcquisitionInputEnvelopeObjectSchema } from './TaskCreateManyAcquisitionInputEnvelope.schema';
import { TaskWhereUniqueInputObjectSchema as TaskWhereUniqueInputObjectSchema } from './TaskWhereUniqueInput.schema';
import { TaskUpdateWithWhereUniqueWithoutAcquisitionInputObjectSchema as TaskUpdateWithWhereUniqueWithoutAcquisitionInputObjectSchema } from './TaskUpdateWithWhereUniqueWithoutAcquisitionInput.schema';
import { TaskUpdateManyWithWhereWithoutAcquisitionInputObjectSchema as TaskUpdateManyWithWhereWithoutAcquisitionInputObjectSchema } from './TaskUpdateManyWithWhereWithoutAcquisitionInput.schema';
import { TaskScalarWhereInputObjectSchema as TaskScalarWhereInputObjectSchema } from './TaskScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TaskCreateWithoutAcquisitionInputObjectSchema), z.lazy(() => TaskCreateWithoutAcquisitionInputObjectSchema).array(), z.lazy(() => TaskUncheckedCreateWithoutAcquisitionInputObjectSchema), z.lazy(() => TaskUncheckedCreateWithoutAcquisitionInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => TaskCreateOrConnectWithoutAcquisitionInputObjectSchema), z.lazy(() => TaskCreateOrConnectWithoutAcquisitionInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => TaskUpsertWithWhereUniqueWithoutAcquisitionInputObjectSchema), z.lazy(() => TaskUpsertWithWhereUniqueWithoutAcquisitionInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => TaskCreateManyAcquisitionInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => TaskWhereUniqueInputObjectSchema), z.lazy(() => TaskWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => TaskWhereUniqueInputObjectSchema), z.lazy(() => TaskWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => TaskWhereUniqueInputObjectSchema), z.lazy(() => TaskWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => TaskWhereUniqueInputObjectSchema), z.lazy(() => TaskWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => TaskUpdateWithWhereUniqueWithoutAcquisitionInputObjectSchema), z.lazy(() => TaskUpdateWithWhereUniqueWithoutAcquisitionInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => TaskUpdateManyWithWhereWithoutAcquisitionInputObjectSchema), z.lazy(() => TaskUpdateManyWithWhereWithoutAcquisitionInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => TaskScalarWhereInputObjectSchema), z.lazy(() => TaskScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const TaskUpdateManyWithoutAcquisitionNestedInputObjectSchema: z.ZodType<Prisma.TaskUpdateManyWithoutAcquisitionNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskUpdateManyWithoutAcquisitionNestedInput>;
export const TaskUpdateManyWithoutAcquisitionNestedInputObjectZodSchema = makeSchema();
