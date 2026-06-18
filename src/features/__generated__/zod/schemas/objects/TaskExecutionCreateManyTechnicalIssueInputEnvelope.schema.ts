import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskExecutionCreateManyTechnicalIssueInputObjectSchema as TaskExecutionCreateManyTechnicalIssueInputObjectSchema } from './TaskExecutionCreateManyTechnicalIssueInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => TaskExecutionCreateManyTechnicalIssueInputObjectSchema), z.lazy(() => TaskExecutionCreateManyTechnicalIssueInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const TaskExecutionCreateManyTechnicalIssueInputEnvelopeObjectSchema: z.ZodType<Prisma.TaskExecutionCreateManyTechnicalIssueInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.TaskExecutionCreateManyTechnicalIssueInputEnvelope>;
export const TaskExecutionCreateManyTechnicalIssueInputEnvelopeObjectZodSchema = makeSchema();
