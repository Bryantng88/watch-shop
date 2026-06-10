import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskExecutionCreateManyCreatedByUserInputObjectSchema as TaskExecutionCreateManyCreatedByUserInputObjectSchema } from './TaskExecutionCreateManyCreatedByUserInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => TaskExecutionCreateManyCreatedByUserInputObjectSchema), z.lazy(() => TaskExecutionCreateManyCreatedByUserInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const TaskExecutionCreateManyCreatedByUserInputEnvelopeObjectSchema: z.ZodType<Prisma.TaskExecutionCreateManyCreatedByUserInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.TaskExecutionCreateManyCreatedByUserInputEnvelope>;
export const TaskExecutionCreateManyCreatedByUserInputEnvelopeObjectZodSchema = makeSchema();
