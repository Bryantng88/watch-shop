import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskScalarWhereInputObjectSchema as TaskScalarWhereInputObjectSchema } from './TaskScalarWhereInput.schema';
import { TaskUpdateManyMutationInputObjectSchema as TaskUpdateManyMutationInputObjectSchema } from './TaskUpdateManyMutationInput.schema';
import { TaskUncheckedUpdateManyWithoutTechnicalIssueInputObjectSchema as TaskUncheckedUpdateManyWithoutTechnicalIssueInputObjectSchema } from './TaskUncheckedUpdateManyWithoutTechnicalIssueInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => TaskUpdateManyMutationInputObjectSchema), z.lazy(() => TaskUncheckedUpdateManyWithoutTechnicalIssueInputObjectSchema)])
}).strict();
export const TaskUpdateManyWithWhereWithoutTechnicalIssueInputObjectSchema: z.ZodType<Prisma.TaskUpdateManyWithWhereWithoutTechnicalIssueInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskUpdateManyWithWhereWithoutTechnicalIssueInput>;
export const TaskUpdateManyWithWhereWithoutTechnicalIssueInputObjectZodSchema = makeSchema();
