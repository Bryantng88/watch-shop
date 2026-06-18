import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskExecutionCreateWithoutTechnicalIssueInputObjectSchema as TaskExecutionCreateWithoutTechnicalIssueInputObjectSchema } from './TaskExecutionCreateWithoutTechnicalIssueInput.schema';
import { TaskExecutionUncheckedCreateWithoutTechnicalIssueInputObjectSchema as TaskExecutionUncheckedCreateWithoutTechnicalIssueInputObjectSchema } from './TaskExecutionUncheckedCreateWithoutTechnicalIssueInput.schema';
import { TaskExecutionCreateOrConnectWithoutTechnicalIssueInputObjectSchema as TaskExecutionCreateOrConnectWithoutTechnicalIssueInputObjectSchema } from './TaskExecutionCreateOrConnectWithoutTechnicalIssueInput.schema';
import { TaskExecutionUpsertWithWhereUniqueWithoutTechnicalIssueInputObjectSchema as TaskExecutionUpsertWithWhereUniqueWithoutTechnicalIssueInputObjectSchema } from './TaskExecutionUpsertWithWhereUniqueWithoutTechnicalIssueInput.schema';
import { TaskExecutionCreateManyTechnicalIssueInputEnvelopeObjectSchema as TaskExecutionCreateManyTechnicalIssueInputEnvelopeObjectSchema } from './TaskExecutionCreateManyTechnicalIssueInputEnvelope.schema';
import { TaskExecutionWhereUniqueInputObjectSchema as TaskExecutionWhereUniqueInputObjectSchema } from './TaskExecutionWhereUniqueInput.schema';
import { TaskExecutionUpdateWithWhereUniqueWithoutTechnicalIssueInputObjectSchema as TaskExecutionUpdateWithWhereUniqueWithoutTechnicalIssueInputObjectSchema } from './TaskExecutionUpdateWithWhereUniqueWithoutTechnicalIssueInput.schema';
import { TaskExecutionUpdateManyWithWhereWithoutTechnicalIssueInputObjectSchema as TaskExecutionUpdateManyWithWhereWithoutTechnicalIssueInputObjectSchema } from './TaskExecutionUpdateManyWithWhereWithoutTechnicalIssueInput.schema';
import { TaskExecutionScalarWhereInputObjectSchema as TaskExecutionScalarWhereInputObjectSchema } from './TaskExecutionScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TaskExecutionCreateWithoutTechnicalIssueInputObjectSchema), z.lazy(() => TaskExecutionCreateWithoutTechnicalIssueInputObjectSchema).array(), z.lazy(() => TaskExecutionUncheckedCreateWithoutTechnicalIssueInputObjectSchema), z.lazy(() => TaskExecutionUncheckedCreateWithoutTechnicalIssueInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => TaskExecutionCreateOrConnectWithoutTechnicalIssueInputObjectSchema), z.lazy(() => TaskExecutionCreateOrConnectWithoutTechnicalIssueInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => TaskExecutionUpsertWithWhereUniqueWithoutTechnicalIssueInputObjectSchema), z.lazy(() => TaskExecutionUpsertWithWhereUniqueWithoutTechnicalIssueInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => TaskExecutionCreateManyTechnicalIssueInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => TaskExecutionWhereUniqueInputObjectSchema), z.lazy(() => TaskExecutionWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => TaskExecutionWhereUniqueInputObjectSchema), z.lazy(() => TaskExecutionWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => TaskExecutionWhereUniqueInputObjectSchema), z.lazy(() => TaskExecutionWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => TaskExecutionWhereUniqueInputObjectSchema), z.lazy(() => TaskExecutionWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => TaskExecutionUpdateWithWhereUniqueWithoutTechnicalIssueInputObjectSchema), z.lazy(() => TaskExecutionUpdateWithWhereUniqueWithoutTechnicalIssueInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => TaskExecutionUpdateManyWithWhereWithoutTechnicalIssueInputObjectSchema), z.lazy(() => TaskExecutionUpdateManyWithWhereWithoutTechnicalIssueInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => TaskExecutionScalarWhereInputObjectSchema), z.lazy(() => TaskExecutionScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const TaskExecutionUpdateManyWithoutTechnicalIssueNestedInputObjectSchema: z.ZodType<Prisma.TaskExecutionUpdateManyWithoutTechnicalIssueNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskExecutionUpdateManyWithoutTechnicalIssueNestedInput>;
export const TaskExecutionUpdateManyWithoutTechnicalIssueNestedInputObjectZodSchema = makeSchema();
