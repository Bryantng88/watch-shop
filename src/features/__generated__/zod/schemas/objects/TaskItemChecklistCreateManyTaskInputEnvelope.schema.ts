import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskItemChecklistCreateManyTaskInputObjectSchema as TaskItemChecklistCreateManyTaskInputObjectSchema } from './TaskItemChecklistCreateManyTaskInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => TaskItemChecklistCreateManyTaskInputObjectSchema), z.lazy(() => TaskItemChecklistCreateManyTaskInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const TaskItemChecklistCreateManyTaskInputEnvelopeObjectSchema: z.ZodType<Prisma.TaskItemChecklistCreateManyTaskInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemChecklistCreateManyTaskInputEnvelope>;
export const TaskItemChecklistCreateManyTaskInputEnvelopeObjectZodSchema = makeSchema();
