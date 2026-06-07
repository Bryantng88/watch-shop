import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskCreateManyTechnicalIssueInputObjectSchema as TaskCreateManyTechnicalIssueInputObjectSchema } from './TaskCreateManyTechnicalIssueInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => TaskCreateManyTechnicalIssueInputObjectSchema), z.lazy(() => TaskCreateManyTechnicalIssueInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const TaskCreateManyTechnicalIssueInputEnvelopeObjectSchema: z.ZodType<Prisma.TaskCreateManyTechnicalIssueInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.TaskCreateManyTechnicalIssueInputEnvelope>;
export const TaskCreateManyTechnicalIssueInputEnvelopeObjectZodSchema = makeSchema();
