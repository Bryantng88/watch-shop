import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskWhereUniqueInputObjectSchema as TaskWhereUniqueInputObjectSchema } from './TaskWhereUniqueInput.schema';
import { TaskCreateWithoutTechnicalIssueInputObjectSchema as TaskCreateWithoutTechnicalIssueInputObjectSchema } from './TaskCreateWithoutTechnicalIssueInput.schema';
import { TaskUncheckedCreateWithoutTechnicalIssueInputObjectSchema as TaskUncheckedCreateWithoutTechnicalIssueInputObjectSchema } from './TaskUncheckedCreateWithoutTechnicalIssueInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => TaskCreateWithoutTechnicalIssueInputObjectSchema), z.lazy(() => TaskUncheckedCreateWithoutTechnicalIssueInputObjectSchema)])
}).strict();
export const TaskCreateOrConnectWithoutTechnicalIssueInputObjectSchema: z.ZodType<Prisma.TaskCreateOrConnectWithoutTechnicalIssueInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskCreateOrConnectWithoutTechnicalIssueInput>;
export const TaskCreateOrConnectWithoutTechnicalIssueInputObjectZodSchema = makeSchema();
