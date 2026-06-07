import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskWhereUniqueInputObjectSchema as TaskWhereUniqueInputObjectSchema } from './TaskWhereUniqueInput.schema';
import { TaskUpdateWithoutTechnicalIssueInputObjectSchema as TaskUpdateWithoutTechnicalIssueInputObjectSchema } from './TaskUpdateWithoutTechnicalIssueInput.schema';
import { TaskUncheckedUpdateWithoutTechnicalIssueInputObjectSchema as TaskUncheckedUpdateWithoutTechnicalIssueInputObjectSchema } from './TaskUncheckedUpdateWithoutTechnicalIssueInput.schema';
import { TaskCreateWithoutTechnicalIssueInputObjectSchema as TaskCreateWithoutTechnicalIssueInputObjectSchema } from './TaskCreateWithoutTechnicalIssueInput.schema';
import { TaskUncheckedCreateWithoutTechnicalIssueInputObjectSchema as TaskUncheckedCreateWithoutTechnicalIssueInputObjectSchema } from './TaskUncheckedCreateWithoutTechnicalIssueInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => TaskUpdateWithoutTechnicalIssueInputObjectSchema), z.lazy(() => TaskUncheckedUpdateWithoutTechnicalIssueInputObjectSchema)]),
  create: z.union([z.lazy(() => TaskCreateWithoutTechnicalIssueInputObjectSchema), z.lazy(() => TaskUncheckedCreateWithoutTechnicalIssueInputObjectSchema)])
}).strict();
export const TaskUpsertWithWhereUniqueWithoutTechnicalIssueInputObjectSchema: z.ZodType<Prisma.TaskUpsertWithWhereUniqueWithoutTechnicalIssueInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskUpsertWithWhereUniqueWithoutTechnicalIssueInput>;
export const TaskUpsertWithWhereUniqueWithoutTechnicalIssueInputObjectZodSchema = makeSchema();
