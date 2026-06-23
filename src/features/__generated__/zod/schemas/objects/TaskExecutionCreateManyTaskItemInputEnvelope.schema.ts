import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskExecutionCreateManyTaskItemInputObjectSchema as TaskExecutionCreateManyTaskItemInputObjectSchema } from './TaskExecutionCreateManyTaskItemInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => TaskExecutionCreateManyTaskItemInputObjectSchema), z.lazy(() => TaskExecutionCreateManyTaskItemInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const TaskExecutionCreateManyTaskItemInputEnvelopeObjectSchema: z.ZodType<Prisma.TaskExecutionCreateManyTaskItemInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.TaskExecutionCreateManyTaskItemInputEnvelope>;
export const TaskExecutionCreateManyTaskItemInputEnvelopeObjectZodSchema = makeSchema();
