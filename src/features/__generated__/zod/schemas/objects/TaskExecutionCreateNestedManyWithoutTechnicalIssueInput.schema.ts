import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskExecutionCreateWithoutTechnicalIssueInputObjectSchema as TaskExecutionCreateWithoutTechnicalIssueInputObjectSchema } from './TaskExecutionCreateWithoutTechnicalIssueInput.schema';
import { TaskExecutionUncheckedCreateWithoutTechnicalIssueInputObjectSchema as TaskExecutionUncheckedCreateWithoutTechnicalIssueInputObjectSchema } from './TaskExecutionUncheckedCreateWithoutTechnicalIssueInput.schema';
import { TaskExecutionCreateOrConnectWithoutTechnicalIssueInputObjectSchema as TaskExecutionCreateOrConnectWithoutTechnicalIssueInputObjectSchema } from './TaskExecutionCreateOrConnectWithoutTechnicalIssueInput.schema';
import { TaskExecutionCreateManyTechnicalIssueInputEnvelopeObjectSchema as TaskExecutionCreateManyTechnicalIssueInputEnvelopeObjectSchema } from './TaskExecutionCreateManyTechnicalIssueInputEnvelope.schema';
import { TaskExecutionWhereUniqueInputObjectSchema as TaskExecutionWhereUniqueInputObjectSchema } from './TaskExecutionWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TaskExecutionCreateWithoutTechnicalIssueInputObjectSchema), z.lazy(() => TaskExecutionCreateWithoutTechnicalIssueInputObjectSchema).array(), z.lazy(() => TaskExecutionUncheckedCreateWithoutTechnicalIssueInputObjectSchema), z.lazy(() => TaskExecutionUncheckedCreateWithoutTechnicalIssueInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => TaskExecutionCreateOrConnectWithoutTechnicalIssueInputObjectSchema), z.lazy(() => TaskExecutionCreateOrConnectWithoutTechnicalIssueInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => TaskExecutionCreateManyTechnicalIssueInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => TaskExecutionWhereUniqueInputObjectSchema), z.lazy(() => TaskExecutionWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const TaskExecutionCreateNestedManyWithoutTechnicalIssueInputObjectSchema: z.ZodType<Prisma.TaskExecutionCreateNestedManyWithoutTechnicalIssueInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskExecutionCreateNestedManyWithoutTechnicalIssueInput>;
export const TaskExecutionCreateNestedManyWithoutTechnicalIssueInputObjectZodSchema = makeSchema();
