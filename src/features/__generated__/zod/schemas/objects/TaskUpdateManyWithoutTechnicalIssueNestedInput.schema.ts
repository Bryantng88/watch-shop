import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskCreateWithoutTechnicalIssueInputObjectSchema as TaskCreateWithoutTechnicalIssueInputObjectSchema } from './TaskCreateWithoutTechnicalIssueInput.schema';
import { TaskUncheckedCreateWithoutTechnicalIssueInputObjectSchema as TaskUncheckedCreateWithoutTechnicalIssueInputObjectSchema } from './TaskUncheckedCreateWithoutTechnicalIssueInput.schema';
import { TaskCreateOrConnectWithoutTechnicalIssueInputObjectSchema as TaskCreateOrConnectWithoutTechnicalIssueInputObjectSchema } from './TaskCreateOrConnectWithoutTechnicalIssueInput.schema';
import { TaskUpsertWithWhereUniqueWithoutTechnicalIssueInputObjectSchema as TaskUpsertWithWhereUniqueWithoutTechnicalIssueInputObjectSchema } from './TaskUpsertWithWhereUniqueWithoutTechnicalIssueInput.schema';
import { TaskCreateManyTechnicalIssueInputEnvelopeObjectSchema as TaskCreateManyTechnicalIssueInputEnvelopeObjectSchema } from './TaskCreateManyTechnicalIssueInputEnvelope.schema';
import { TaskWhereUniqueInputObjectSchema as TaskWhereUniqueInputObjectSchema } from './TaskWhereUniqueInput.schema';
import { TaskUpdateWithWhereUniqueWithoutTechnicalIssueInputObjectSchema as TaskUpdateWithWhereUniqueWithoutTechnicalIssueInputObjectSchema } from './TaskUpdateWithWhereUniqueWithoutTechnicalIssueInput.schema';
import { TaskUpdateManyWithWhereWithoutTechnicalIssueInputObjectSchema as TaskUpdateManyWithWhereWithoutTechnicalIssueInputObjectSchema } from './TaskUpdateManyWithWhereWithoutTechnicalIssueInput.schema';
import { TaskScalarWhereInputObjectSchema as TaskScalarWhereInputObjectSchema } from './TaskScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TaskCreateWithoutTechnicalIssueInputObjectSchema), z.lazy(() => TaskCreateWithoutTechnicalIssueInputObjectSchema).array(), z.lazy(() => TaskUncheckedCreateWithoutTechnicalIssueInputObjectSchema), z.lazy(() => TaskUncheckedCreateWithoutTechnicalIssueInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => TaskCreateOrConnectWithoutTechnicalIssueInputObjectSchema), z.lazy(() => TaskCreateOrConnectWithoutTechnicalIssueInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => TaskUpsertWithWhereUniqueWithoutTechnicalIssueInputObjectSchema), z.lazy(() => TaskUpsertWithWhereUniqueWithoutTechnicalIssueInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => TaskCreateManyTechnicalIssueInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => TaskWhereUniqueInputObjectSchema), z.lazy(() => TaskWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => TaskWhereUniqueInputObjectSchema), z.lazy(() => TaskWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => TaskWhereUniqueInputObjectSchema), z.lazy(() => TaskWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => TaskWhereUniqueInputObjectSchema), z.lazy(() => TaskWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => TaskUpdateWithWhereUniqueWithoutTechnicalIssueInputObjectSchema), z.lazy(() => TaskUpdateWithWhereUniqueWithoutTechnicalIssueInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => TaskUpdateManyWithWhereWithoutTechnicalIssueInputObjectSchema), z.lazy(() => TaskUpdateManyWithWhereWithoutTechnicalIssueInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => TaskScalarWhereInputObjectSchema), z.lazy(() => TaskScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const TaskUpdateManyWithoutTechnicalIssueNestedInputObjectSchema: z.ZodType<Prisma.TaskUpdateManyWithoutTechnicalIssueNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskUpdateManyWithoutTechnicalIssueNestedInput>;
export const TaskUpdateManyWithoutTechnicalIssueNestedInputObjectZodSchema = makeSchema();
