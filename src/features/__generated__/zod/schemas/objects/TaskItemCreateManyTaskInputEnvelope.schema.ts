import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskItemCreateManyTaskInputObjectSchema as TaskItemCreateManyTaskInputObjectSchema } from './TaskItemCreateManyTaskInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => TaskItemCreateManyTaskInputObjectSchema), z.lazy(() => TaskItemCreateManyTaskInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const TaskItemCreateManyTaskInputEnvelopeObjectSchema: z.ZodType<Prisma.TaskItemCreateManyTaskInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemCreateManyTaskInputEnvelope>;
export const TaskItemCreateManyTaskInputEnvelopeObjectZodSchema = makeSchema();
