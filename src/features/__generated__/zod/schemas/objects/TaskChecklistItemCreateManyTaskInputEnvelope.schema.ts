import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskChecklistItemCreateManyTaskInputObjectSchema as TaskChecklistItemCreateManyTaskInputObjectSchema } from './TaskChecklistItemCreateManyTaskInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => TaskChecklistItemCreateManyTaskInputObjectSchema), z.lazy(() => TaskChecklistItemCreateManyTaskInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const TaskChecklistItemCreateManyTaskInputEnvelopeObjectSchema: z.ZodType<Prisma.TaskChecklistItemCreateManyTaskInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.TaskChecklistItemCreateManyTaskInputEnvelope>;
export const TaskChecklistItemCreateManyTaskInputEnvelopeObjectZodSchema = makeSchema();
