import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskWhereUniqueInputObjectSchema as TaskWhereUniqueInputObjectSchema } from './TaskWhereUniqueInput.schema';
import { TaskUpdateWithoutTechnicalIssueInputObjectSchema as TaskUpdateWithoutTechnicalIssueInputObjectSchema } from './TaskUpdateWithoutTechnicalIssueInput.schema';
import { TaskUncheckedUpdateWithoutTechnicalIssueInputObjectSchema as TaskUncheckedUpdateWithoutTechnicalIssueInputObjectSchema } from './TaskUncheckedUpdateWithoutTechnicalIssueInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => TaskUpdateWithoutTechnicalIssueInputObjectSchema), z.lazy(() => TaskUncheckedUpdateWithoutTechnicalIssueInputObjectSchema)])
}).strict();
export const TaskUpdateWithWhereUniqueWithoutTechnicalIssueInputObjectSchema: z.ZodType<Prisma.TaskUpdateWithWhereUniqueWithoutTechnicalIssueInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskUpdateWithWhereUniqueWithoutTechnicalIssueInput>;
export const TaskUpdateWithWhereUniqueWithoutTechnicalIssueInputObjectZodSchema = makeSchema();
