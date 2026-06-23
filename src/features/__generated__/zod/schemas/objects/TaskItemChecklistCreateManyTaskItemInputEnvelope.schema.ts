import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskItemChecklistCreateManyTaskItemInputObjectSchema as TaskItemChecklistCreateManyTaskItemInputObjectSchema } from './TaskItemChecklistCreateManyTaskItemInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => TaskItemChecklistCreateManyTaskItemInputObjectSchema), z.lazy(() => TaskItemChecklistCreateManyTaskItemInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const TaskItemChecklistCreateManyTaskItemInputEnvelopeObjectSchema: z.ZodType<Prisma.TaskItemChecklistCreateManyTaskItemInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemChecklistCreateManyTaskItemInputEnvelope>;
export const TaskItemChecklistCreateManyTaskItemInputEnvelopeObjectZodSchema = makeSchema();
