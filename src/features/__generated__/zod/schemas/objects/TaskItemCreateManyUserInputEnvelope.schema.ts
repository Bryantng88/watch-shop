import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskItemCreateManyUserInputObjectSchema as TaskItemCreateManyUserInputObjectSchema } from './TaskItemCreateManyUserInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => TaskItemCreateManyUserInputObjectSchema), z.lazy(() => TaskItemCreateManyUserInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const TaskItemCreateManyUserInputEnvelopeObjectSchema: z.ZodType<Prisma.TaskItemCreateManyUserInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemCreateManyUserInputEnvelope>;
export const TaskItemCreateManyUserInputEnvelopeObjectZodSchema = makeSchema();
