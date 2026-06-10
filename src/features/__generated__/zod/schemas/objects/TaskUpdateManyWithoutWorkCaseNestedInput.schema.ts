import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskCreateWithoutWorkCaseInputObjectSchema as TaskCreateWithoutWorkCaseInputObjectSchema } from './TaskCreateWithoutWorkCaseInput.schema';
import { TaskUncheckedCreateWithoutWorkCaseInputObjectSchema as TaskUncheckedCreateWithoutWorkCaseInputObjectSchema } from './TaskUncheckedCreateWithoutWorkCaseInput.schema';
import { TaskCreateOrConnectWithoutWorkCaseInputObjectSchema as TaskCreateOrConnectWithoutWorkCaseInputObjectSchema } from './TaskCreateOrConnectWithoutWorkCaseInput.schema';
import { TaskUpsertWithWhereUniqueWithoutWorkCaseInputObjectSchema as TaskUpsertWithWhereUniqueWithoutWorkCaseInputObjectSchema } from './TaskUpsertWithWhereUniqueWithoutWorkCaseInput.schema';
import { TaskCreateManyWorkCaseInputEnvelopeObjectSchema as TaskCreateManyWorkCaseInputEnvelopeObjectSchema } from './TaskCreateManyWorkCaseInputEnvelope.schema';
import { TaskWhereUniqueInputObjectSchema as TaskWhereUniqueInputObjectSchema } from './TaskWhereUniqueInput.schema';
import { TaskUpdateWithWhereUniqueWithoutWorkCaseInputObjectSchema as TaskUpdateWithWhereUniqueWithoutWorkCaseInputObjectSchema } from './TaskUpdateWithWhereUniqueWithoutWorkCaseInput.schema';
import { TaskUpdateManyWithWhereWithoutWorkCaseInputObjectSchema as TaskUpdateManyWithWhereWithoutWorkCaseInputObjectSchema } from './TaskUpdateManyWithWhereWithoutWorkCaseInput.schema';
import { TaskScalarWhereInputObjectSchema as TaskScalarWhereInputObjectSchema } from './TaskScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TaskCreateWithoutWorkCaseInputObjectSchema), z.lazy(() => TaskCreateWithoutWorkCaseInputObjectSchema).array(), z.lazy(() => TaskUncheckedCreateWithoutWorkCaseInputObjectSchema), z.lazy(() => TaskUncheckedCreateWithoutWorkCaseInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => TaskCreateOrConnectWithoutWorkCaseInputObjectSchema), z.lazy(() => TaskCreateOrConnectWithoutWorkCaseInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => TaskUpsertWithWhereUniqueWithoutWorkCaseInputObjectSchema), z.lazy(() => TaskUpsertWithWhereUniqueWithoutWorkCaseInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => TaskCreateManyWorkCaseInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => TaskWhereUniqueInputObjectSchema), z.lazy(() => TaskWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => TaskWhereUniqueInputObjectSchema), z.lazy(() => TaskWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => TaskWhereUniqueInputObjectSchema), z.lazy(() => TaskWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => TaskWhereUniqueInputObjectSchema), z.lazy(() => TaskWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => TaskUpdateWithWhereUniqueWithoutWorkCaseInputObjectSchema), z.lazy(() => TaskUpdateWithWhereUniqueWithoutWorkCaseInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => TaskUpdateManyWithWhereWithoutWorkCaseInputObjectSchema), z.lazy(() => TaskUpdateManyWithWhereWithoutWorkCaseInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => TaskScalarWhereInputObjectSchema), z.lazy(() => TaskScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const TaskUpdateManyWithoutWorkCaseNestedInputObjectSchema: z.ZodType<Prisma.TaskUpdateManyWithoutWorkCaseNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskUpdateManyWithoutWorkCaseNestedInput>;
export const TaskUpdateManyWithoutWorkCaseNestedInputObjectZodSchema = makeSchema();
