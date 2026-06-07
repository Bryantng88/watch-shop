import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskCreateWithoutServiceRequestInputObjectSchema as TaskCreateWithoutServiceRequestInputObjectSchema } from './TaskCreateWithoutServiceRequestInput.schema';
import { TaskUncheckedCreateWithoutServiceRequestInputObjectSchema as TaskUncheckedCreateWithoutServiceRequestInputObjectSchema } from './TaskUncheckedCreateWithoutServiceRequestInput.schema';
import { TaskCreateOrConnectWithoutServiceRequestInputObjectSchema as TaskCreateOrConnectWithoutServiceRequestInputObjectSchema } from './TaskCreateOrConnectWithoutServiceRequestInput.schema';
import { TaskUpsertWithWhereUniqueWithoutServiceRequestInputObjectSchema as TaskUpsertWithWhereUniqueWithoutServiceRequestInputObjectSchema } from './TaskUpsertWithWhereUniqueWithoutServiceRequestInput.schema';
import { TaskCreateManyServiceRequestInputEnvelopeObjectSchema as TaskCreateManyServiceRequestInputEnvelopeObjectSchema } from './TaskCreateManyServiceRequestInputEnvelope.schema';
import { TaskWhereUniqueInputObjectSchema as TaskWhereUniqueInputObjectSchema } from './TaskWhereUniqueInput.schema';
import { TaskUpdateWithWhereUniqueWithoutServiceRequestInputObjectSchema as TaskUpdateWithWhereUniqueWithoutServiceRequestInputObjectSchema } from './TaskUpdateWithWhereUniqueWithoutServiceRequestInput.schema';
import { TaskUpdateManyWithWhereWithoutServiceRequestInputObjectSchema as TaskUpdateManyWithWhereWithoutServiceRequestInputObjectSchema } from './TaskUpdateManyWithWhereWithoutServiceRequestInput.schema';
import { TaskScalarWhereInputObjectSchema as TaskScalarWhereInputObjectSchema } from './TaskScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TaskCreateWithoutServiceRequestInputObjectSchema), z.lazy(() => TaskCreateWithoutServiceRequestInputObjectSchema).array(), z.lazy(() => TaskUncheckedCreateWithoutServiceRequestInputObjectSchema), z.lazy(() => TaskUncheckedCreateWithoutServiceRequestInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => TaskCreateOrConnectWithoutServiceRequestInputObjectSchema), z.lazy(() => TaskCreateOrConnectWithoutServiceRequestInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => TaskUpsertWithWhereUniqueWithoutServiceRequestInputObjectSchema), z.lazy(() => TaskUpsertWithWhereUniqueWithoutServiceRequestInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => TaskCreateManyServiceRequestInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => TaskWhereUniqueInputObjectSchema), z.lazy(() => TaskWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => TaskWhereUniqueInputObjectSchema), z.lazy(() => TaskWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => TaskWhereUniqueInputObjectSchema), z.lazy(() => TaskWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => TaskWhereUniqueInputObjectSchema), z.lazy(() => TaskWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => TaskUpdateWithWhereUniqueWithoutServiceRequestInputObjectSchema), z.lazy(() => TaskUpdateWithWhereUniqueWithoutServiceRequestInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => TaskUpdateManyWithWhereWithoutServiceRequestInputObjectSchema), z.lazy(() => TaskUpdateManyWithWhereWithoutServiceRequestInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => TaskScalarWhereInputObjectSchema), z.lazy(() => TaskScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const TaskUncheckedUpdateManyWithoutServiceRequestNestedInputObjectSchema: z.ZodType<Prisma.TaskUncheckedUpdateManyWithoutServiceRequestNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskUncheckedUpdateManyWithoutServiceRequestNestedInput>;
export const TaskUncheckedUpdateManyWithoutServiceRequestNestedInputObjectZodSchema = makeSchema();
