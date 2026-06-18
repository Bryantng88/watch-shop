import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskExecutionWhereUniqueInputObjectSchema as TaskExecutionWhereUniqueInputObjectSchema } from './TaskExecutionWhereUniqueInput.schema';
import { TaskExecutionUpdateWithoutTechnicalIssueInputObjectSchema as TaskExecutionUpdateWithoutTechnicalIssueInputObjectSchema } from './TaskExecutionUpdateWithoutTechnicalIssueInput.schema';
import { TaskExecutionUncheckedUpdateWithoutTechnicalIssueInputObjectSchema as TaskExecutionUncheckedUpdateWithoutTechnicalIssueInputObjectSchema } from './TaskExecutionUncheckedUpdateWithoutTechnicalIssueInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskExecutionWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => TaskExecutionUpdateWithoutTechnicalIssueInputObjectSchema), z.lazy(() => TaskExecutionUncheckedUpdateWithoutTechnicalIssueInputObjectSchema)])
}).strict();
export const TaskExecutionUpdateWithWhereUniqueWithoutTechnicalIssueInputObjectSchema: z.ZodType<Prisma.TaskExecutionUpdateWithWhereUniqueWithoutTechnicalIssueInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskExecutionUpdateWithWhereUniqueWithoutTechnicalIssueInput>;
export const TaskExecutionUpdateWithWhereUniqueWithoutTechnicalIssueInputObjectZodSchema = makeSchema();
