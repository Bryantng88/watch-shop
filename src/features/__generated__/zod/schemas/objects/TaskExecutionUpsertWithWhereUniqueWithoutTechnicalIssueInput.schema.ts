import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskExecutionWhereUniqueInputObjectSchema as TaskExecutionWhereUniqueInputObjectSchema } from './TaskExecutionWhereUniqueInput.schema';
import { TaskExecutionUpdateWithoutTechnicalIssueInputObjectSchema as TaskExecutionUpdateWithoutTechnicalIssueInputObjectSchema } from './TaskExecutionUpdateWithoutTechnicalIssueInput.schema';
import { TaskExecutionUncheckedUpdateWithoutTechnicalIssueInputObjectSchema as TaskExecutionUncheckedUpdateWithoutTechnicalIssueInputObjectSchema } from './TaskExecutionUncheckedUpdateWithoutTechnicalIssueInput.schema';
import { TaskExecutionCreateWithoutTechnicalIssueInputObjectSchema as TaskExecutionCreateWithoutTechnicalIssueInputObjectSchema } from './TaskExecutionCreateWithoutTechnicalIssueInput.schema';
import { TaskExecutionUncheckedCreateWithoutTechnicalIssueInputObjectSchema as TaskExecutionUncheckedCreateWithoutTechnicalIssueInputObjectSchema } from './TaskExecutionUncheckedCreateWithoutTechnicalIssueInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskExecutionWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => TaskExecutionUpdateWithoutTechnicalIssueInputObjectSchema), z.lazy(() => TaskExecutionUncheckedUpdateWithoutTechnicalIssueInputObjectSchema)]),
  create: z.union([z.lazy(() => TaskExecutionCreateWithoutTechnicalIssueInputObjectSchema), z.lazy(() => TaskExecutionUncheckedCreateWithoutTechnicalIssueInputObjectSchema)])
}).strict();
export const TaskExecutionUpsertWithWhereUniqueWithoutTechnicalIssueInputObjectSchema: z.ZodType<Prisma.TaskExecutionUpsertWithWhereUniqueWithoutTechnicalIssueInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskExecutionUpsertWithWhereUniqueWithoutTechnicalIssueInput>;
export const TaskExecutionUpsertWithWhereUniqueWithoutTechnicalIssueInputObjectZodSchema = makeSchema();
