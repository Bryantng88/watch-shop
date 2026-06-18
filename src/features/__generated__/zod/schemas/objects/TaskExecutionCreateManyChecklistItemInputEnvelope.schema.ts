import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskExecutionCreateManyChecklistItemInputObjectSchema as TaskExecutionCreateManyChecklistItemInputObjectSchema } from './TaskExecutionCreateManyChecklistItemInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => TaskExecutionCreateManyChecklistItemInputObjectSchema), z.lazy(() => TaskExecutionCreateManyChecklistItemInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const TaskExecutionCreateManyChecklistItemInputEnvelopeObjectSchema: z.ZodType<Prisma.TaskExecutionCreateManyChecklistItemInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.TaskExecutionCreateManyChecklistItemInputEnvelope>;
export const TaskExecutionCreateManyChecklistItemInputEnvelopeObjectZodSchema = makeSchema();
