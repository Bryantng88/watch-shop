import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskCreateManyTaskActionInputObjectSchema as TaskCreateManyTaskActionInputObjectSchema } from './TaskCreateManyTaskActionInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => TaskCreateManyTaskActionInputObjectSchema), z.lazy(() => TaskCreateManyTaskActionInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const TaskCreateManyTaskActionInputEnvelopeObjectSchema: z.ZodType<Prisma.TaskCreateManyTaskActionInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.TaskCreateManyTaskActionInputEnvelope>;
export const TaskCreateManyTaskActionInputEnvelopeObjectZodSchema = makeSchema();
