import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskChecklistItemCreateManyUserInputObjectSchema as TaskChecklistItemCreateManyUserInputObjectSchema } from './TaskChecklistItemCreateManyUserInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => TaskChecklistItemCreateManyUserInputObjectSchema), z.lazy(() => TaskChecklistItemCreateManyUserInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const TaskChecklistItemCreateManyUserInputEnvelopeObjectSchema: z.ZodType<Prisma.TaskChecklistItemCreateManyUserInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.TaskChecklistItemCreateManyUserInputEnvelope>;
export const TaskChecklistItemCreateManyUserInputEnvelopeObjectZodSchema = makeSchema();
