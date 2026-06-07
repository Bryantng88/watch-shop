import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskCreateWithoutShipmentInputObjectSchema as TaskCreateWithoutShipmentInputObjectSchema } from './TaskCreateWithoutShipmentInput.schema';
import { TaskUncheckedCreateWithoutShipmentInputObjectSchema as TaskUncheckedCreateWithoutShipmentInputObjectSchema } from './TaskUncheckedCreateWithoutShipmentInput.schema';
import { TaskCreateOrConnectWithoutShipmentInputObjectSchema as TaskCreateOrConnectWithoutShipmentInputObjectSchema } from './TaskCreateOrConnectWithoutShipmentInput.schema';
import { TaskUpsertWithWhereUniqueWithoutShipmentInputObjectSchema as TaskUpsertWithWhereUniqueWithoutShipmentInputObjectSchema } from './TaskUpsertWithWhereUniqueWithoutShipmentInput.schema';
import { TaskCreateManyShipmentInputEnvelopeObjectSchema as TaskCreateManyShipmentInputEnvelopeObjectSchema } from './TaskCreateManyShipmentInputEnvelope.schema';
import { TaskWhereUniqueInputObjectSchema as TaskWhereUniqueInputObjectSchema } from './TaskWhereUniqueInput.schema';
import { TaskUpdateWithWhereUniqueWithoutShipmentInputObjectSchema as TaskUpdateWithWhereUniqueWithoutShipmentInputObjectSchema } from './TaskUpdateWithWhereUniqueWithoutShipmentInput.schema';
import { TaskUpdateManyWithWhereWithoutShipmentInputObjectSchema as TaskUpdateManyWithWhereWithoutShipmentInputObjectSchema } from './TaskUpdateManyWithWhereWithoutShipmentInput.schema';
import { TaskScalarWhereInputObjectSchema as TaskScalarWhereInputObjectSchema } from './TaskScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TaskCreateWithoutShipmentInputObjectSchema), z.lazy(() => TaskCreateWithoutShipmentInputObjectSchema).array(), z.lazy(() => TaskUncheckedCreateWithoutShipmentInputObjectSchema), z.lazy(() => TaskUncheckedCreateWithoutShipmentInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => TaskCreateOrConnectWithoutShipmentInputObjectSchema), z.lazy(() => TaskCreateOrConnectWithoutShipmentInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => TaskUpsertWithWhereUniqueWithoutShipmentInputObjectSchema), z.lazy(() => TaskUpsertWithWhereUniqueWithoutShipmentInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => TaskCreateManyShipmentInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => TaskWhereUniqueInputObjectSchema), z.lazy(() => TaskWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => TaskWhereUniqueInputObjectSchema), z.lazy(() => TaskWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => TaskWhereUniqueInputObjectSchema), z.lazy(() => TaskWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => TaskWhereUniqueInputObjectSchema), z.lazy(() => TaskWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => TaskUpdateWithWhereUniqueWithoutShipmentInputObjectSchema), z.lazy(() => TaskUpdateWithWhereUniqueWithoutShipmentInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => TaskUpdateManyWithWhereWithoutShipmentInputObjectSchema), z.lazy(() => TaskUpdateManyWithWhereWithoutShipmentInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => TaskScalarWhereInputObjectSchema), z.lazy(() => TaskScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const TaskUpdateManyWithoutShipmentNestedInputObjectSchema: z.ZodType<Prisma.TaskUpdateManyWithoutShipmentNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskUpdateManyWithoutShipmentNestedInput>;
export const TaskUpdateManyWithoutShipmentNestedInputObjectZodSchema = makeSchema();
