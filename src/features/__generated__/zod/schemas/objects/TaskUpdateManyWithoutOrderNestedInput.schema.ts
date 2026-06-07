import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskCreateWithoutOrderInputObjectSchema as TaskCreateWithoutOrderInputObjectSchema } from './TaskCreateWithoutOrderInput.schema';
import { TaskUncheckedCreateWithoutOrderInputObjectSchema as TaskUncheckedCreateWithoutOrderInputObjectSchema } from './TaskUncheckedCreateWithoutOrderInput.schema';
import { TaskCreateOrConnectWithoutOrderInputObjectSchema as TaskCreateOrConnectWithoutOrderInputObjectSchema } from './TaskCreateOrConnectWithoutOrderInput.schema';
import { TaskUpsertWithWhereUniqueWithoutOrderInputObjectSchema as TaskUpsertWithWhereUniqueWithoutOrderInputObjectSchema } from './TaskUpsertWithWhereUniqueWithoutOrderInput.schema';
import { TaskCreateManyOrderInputEnvelopeObjectSchema as TaskCreateManyOrderInputEnvelopeObjectSchema } from './TaskCreateManyOrderInputEnvelope.schema';
import { TaskWhereUniqueInputObjectSchema as TaskWhereUniqueInputObjectSchema } from './TaskWhereUniqueInput.schema';
import { TaskUpdateWithWhereUniqueWithoutOrderInputObjectSchema as TaskUpdateWithWhereUniqueWithoutOrderInputObjectSchema } from './TaskUpdateWithWhereUniqueWithoutOrderInput.schema';
import { TaskUpdateManyWithWhereWithoutOrderInputObjectSchema as TaskUpdateManyWithWhereWithoutOrderInputObjectSchema } from './TaskUpdateManyWithWhereWithoutOrderInput.schema';
import { TaskScalarWhereInputObjectSchema as TaskScalarWhereInputObjectSchema } from './TaskScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TaskCreateWithoutOrderInputObjectSchema), z.lazy(() => TaskCreateWithoutOrderInputObjectSchema).array(), z.lazy(() => TaskUncheckedCreateWithoutOrderInputObjectSchema), z.lazy(() => TaskUncheckedCreateWithoutOrderInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => TaskCreateOrConnectWithoutOrderInputObjectSchema), z.lazy(() => TaskCreateOrConnectWithoutOrderInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => TaskUpsertWithWhereUniqueWithoutOrderInputObjectSchema), z.lazy(() => TaskUpsertWithWhereUniqueWithoutOrderInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => TaskCreateManyOrderInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => TaskWhereUniqueInputObjectSchema), z.lazy(() => TaskWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => TaskWhereUniqueInputObjectSchema), z.lazy(() => TaskWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => TaskWhereUniqueInputObjectSchema), z.lazy(() => TaskWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => TaskWhereUniqueInputObjectSchema), z.lazy(() => TaskWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => TaskUpdateWithWhereUniqueWithoutOrderInputObjectSchema), z.lazy(() => TaskUpdateWithWhereUniqueWithoutOrderInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => TaskUpdateManyWithWhereWithoutOrderInputObjectSchema), z.lazy(() => TaskUpdateManyWithWhereWithoutOrderInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => TaskScalarWhereInputObjectSchema), z.lazy(() => TaskScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const TaskUpdateManyWithoutOrderNestedInputObjectSchema: z.ZodType<Prisma.TaskUpdateManyWithoutOrderNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskUpdateManyWithoutOrderNestedInput>;
export const TaskUpdateManyWithoutOrderNestedInputObjectZodSchema = makeSchema();
