import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskExecutionScalarWhereInputObjectSchema as TaskExecutionScalarWhereInputObjectSchema } from './TaskExecutionScalarWhereInput.schema';
import { TaskExecutionUpdateManyMutationInputObjectSchema as TaskExecutionUpdateManyMutationInputObjectSchema } from './TaskExecutionUpdateManyMutationInput.schema';
import { TaskExecutionUncheckedUpdateManyWithoutTechnicalIssueInputObjectSchema as TaskExecutionUncheckedUpdateManyWithoutTechnicalIssueInputObjectSchema } from './TaskExecutionUncheckedUpdateManyWithoutTechnicalIssueInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskExecutionScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => TaskExecutionUpdateManyMutationInputObjectSchema), z.lazy(() => TaskExecutionUncheckedUpdateManyWithoutTechnicalIssueInputObjectSchema)])
}).strict();
export const TaskExecutionUpdateManyWithWhereWithoutTechnicalIssueInputObjectSchema: z.ZodType<Prisma.TaskExecutionUpdateManyWithWhereWithoutTechnicalIssueInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskExecutionUpdateManyWithWhereWithoutTechnicalIssueInput>;
export const TaskExecutionUpdateManyWithWhereWithoutTechnicalIssueInputObjectZodSchema = makeSchema();
