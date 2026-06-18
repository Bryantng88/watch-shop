import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskExecutionWhereUniqueInputObjectSchema as TaskExecutionWhereUniqueInputObjectSchema } from './TaskExecutionWhereUniqueInput.schema';
import { TaskExecutionCreateWithoutTechnicalIssueInputObjectSchema as TaskExecutionCreateWithoutTechnicalIssueInputObjectSchema } from './TaskExecutionCreateWithoutTechnicalIssueInput.schema';
import { TaskExecutionUncheckedCreateWithoutTechnicalIssueInputObjectSchema as TaskExecutionUncheckedCreateWithoutTechnicalIssueInputObjectSchema } from './TaskExecutionUncheckedCreateWithoutTechnicalIssueInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskExecutionWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => TaskExecutionCreateWithoutTechnicalIssueInputObjectSchema), z.lazy(() => TaskExecutionUncheckedCreateWithoutTechnicalIssueInputObjectSchema)])
}).strict();
export const TaskExecutionCreateOrConnectWithoutTechnicalIssueInputObjectSchema: z.ZodType<Prisma.TaskExecutionCreateOrConnectWithoutTechnicalIssueInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskExecutionCreateOrConnectWithoutTechnicalIssueInput>;
export const TaskExecutionCreateOrConnectWithoutTechnicalIssueInputObjectZodSchema = makeSchema();
