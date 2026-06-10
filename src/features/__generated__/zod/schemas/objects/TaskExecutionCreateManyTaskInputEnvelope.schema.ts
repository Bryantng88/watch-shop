import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskExecutionCreateManyTaskInputObjectSchema as TaskExecutionCreateManyTaskInputObjectSchema } from './TaskExecutionCreateManyTaskInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => TaskExecutionCreateManyTaskInputObjectSchema), z.lazy(() => TaskExecutionCreateManyTaskInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const TaskExecutionCreateManyTaskInputEnvelopeObjectSchema: z.ZodType<Prisma.TaskExecutionCreateManyTaskInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.TaskExecutionCreateManyTaskInputEnvelope>;
export const TaskExecutionCreateManyTaskInputEnvelopeObjectZodSchema = makeSchema();
