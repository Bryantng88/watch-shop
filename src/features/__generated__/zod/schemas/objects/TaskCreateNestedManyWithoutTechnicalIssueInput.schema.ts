import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskCreateWithoutTechnicalIssueInputObjectSchema as TaskCreateWithoutTechnicalIssueInputObjectSchema } from './TaskCreateWithoutTechnicalIssueInput.schema';
import { TaskUncheckedCreateWithoutTechnicalIssueInputObjectSchema as TaskUncheckedCreateWithoutTechnicalIssueInputObjectSchema } from './TaskUncheckedCreateWithoutTechnicalIssueInput.schema';
import { TaskCreateOrConnectWithoutTechnicalIssueInputObjectSchema as TaskCreateOrConnectWithoutTechnicalIssueInputObjectSchema } from './TaskCreateOrConnectWithoutTechnicalIssueInput.schema';
import { TaskCreateManyTechnicalIssueInputEnvelopeObjectSchema as TaskCreateManyTechnicalIssueInputEnvelopeObjectSchema } from './TaskCreateManyTechnicalIssueInputEnvelope.schema';
import { TaskWhereUniqueInputObjectSchema as TaskWhereUniqueInputObjectSchema } from './TaskWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TaskCreateWithoutTechnicalIssueInputObjectSchema), z.lazy(() => TaskCreateWithoutTechnicalIssueInputObjectSchema).array(), z.lazy(() => TaskUncheckedCreateWithoutTechnicalIssueInputObjectSchema), z.lazy(() => TaskUncheckedCreateWithoutTechnicalIssueInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => TaskCreateOrConnectWithoutTechnicalIssueInputObjectSchema), z.lazy(() => TaskCreateOrConnectWithoutTechnicalIssueInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => TaskCreateManyTechnicalIssueInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => TaskWhereUniqueInputObjectSchema), z.lazy(() => TaskWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const TaskCreateNestedManyWithoutTechnicalIssueInputObjectSchema: z.ZodType<Prisma.TaskCreateNestedManyWithoutTechnicalIssueInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskCreateNestedManyWithoutTechnicalIssueInput>;
export const TaskCreateNestedManyWithoutTechnicalIssueInputObjectZodSchema = makeSchema();
