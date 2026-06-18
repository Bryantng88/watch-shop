import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskExecutionCreateWithoutServiceRequestInputObjectSchema as TaskExecutionCreateWithoutServiceRequestInputObjectSchema } from './TaskExecutionCreateWithoutServiceRequestInput.schema';
import { TaskExecutionUncheckedCreateWithoutServiceRequestInputObjectSchema as TaskExecutionUncheckedCreateWithoutServiceRequestInputObjectSchema } from './TaskExecutionUncheckedCreateWithoutServiceRequestInput.schema';
import { TaskExecutionCreateOrConnectWithoutServiceRequestInputObjectSchema as TaskExecutionCreateOrConnectWithoutServiceRequestInputObjectSchema } from './TaskExecutionCreateOrConnectWithoutServiceRequestInput.schema';
import { TaskExecutionUpsertWithWhereUniqueWithoutServiceRequestInputObjectSchema as TaskExecutionUpsertWithWhereUniqueWithoutServiceRequestInputObjectSchema } from './TaskExecutionUpsertWithWhereUniqueWithoutServiceRequestInput.schema';
import { TaskExecutionCreateManyServiceRequestInputEnvelopeObjectSchema as TaskExecutionCreateManyServiceRequestInputEnvelopeObjectSchema } from './TaskExecutionCreateManyServiceRequestInputEnvelope.schema';
import { TaskExecutionWhereUniqueInputObjectSchema as TaskExecutionWhereUniqueInputObjectSchema } from './TaskExecutionWhereUniqueInput.schema';
import { TaskExecutionUpdateWithWhereUniqueWithoutServiceRequestInputObjectSchema as TaskExecutionUpdateWithWhereUniqueWithoutServiceRequestInputObjectSchema } from './TaskExecutionUpdateWithWhereUniqueWithoutServiceRequestInput.schema';
import { TaskExecutionUpdateManyWithWhereWithoutServiceRequestInputObjectSchema as TaskExecutionUpdateManyWithWhereWithoutServiceRequestInputObjectSchema } from './TaskExecutionUpdateManyWithWhereWithoutServiceRequestInput.schema';
import { TaskExecutionScalarWhereInputObjectSchema as TaskExecutionScalarWhereInputObjectSchema } from './TaskExecutionScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TaskExecutionCreateWithoutServiceRequestInputObjectSchema), z.lazy(() => TaskExecutionCreateWithoutServiceRequestInputObjectSchema).array(), z.lazy(() => TaskExecutionUncheckedCreateWithoutServiceRequestInputObjectSchema), z.lazy(() => TaskExecutionUncheckedCreateWithoutServiceRequestInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => TaskExecutionCreateOrConnectWithoutServiceRequestInputObjectSchema), z.lazy(() => TaskExecutionCreateOrConnectWithoutServiceRequestInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => TaskExecutionUpsertWithWhereUniqueWithoutServiceRequestInputObjectSchema), z.lazy(() => TaskExecutionUpsertWithWhereUniqueWithoutServiceRequestInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => TaskExecutionCreateManyServiceRequestInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => TaskExecutionWhereUniqueInputObjectSchema), z.lazy(() => TaskExecutionWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => TaskExecutionWhereUniqueInputObjectSchema), z.lazy(() => TaskExecutionWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => TaskExecutionWhereUniqueInputObjectSchema), z.lazy(() => TaskExecutionWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => TaskExecutionWhereUniqueInputObjectSchema), z.lazy(() => TaskExecutionWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => TaskExecutionUpdateWithWhereUniqueWithoutServiceRequestInputObjectSchema), z.lazy(() => TaskExecutionUpdateWithWhereUniqueWithoutServiceRequestInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => TaskExecutionUpdateManyWithWhereWithoutServiceRequestInputObjectSchema), z.lazy(() => TaskExecutionUpdateManyWithWhereWithoutServiceRequestInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => TaskExecutionScalarWhereInputObjectSchema), z.lazy(() => TaskExecutionScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const TaskExecutionUncheckedUpdateManyWithoutServiceRequestNestedInputObjectSchema: z.ZodType<Prisma.TaskExecutionUncheckedUpdateManyWithoutServiceRequestNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskExecutionUncheckedUpdateManyWithoutServiceRequestNestedInput>;
export const TaskExecutionUncheckedUpdateManyWithoutServiceRequestNestedInputObjectZodSchema = makeSchema();
