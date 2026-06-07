import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskCreateManyCompletedByUserInputObjectSchema as TaskCreateManyCompletedByUserInputObjectSchema } from './TaskCreateManyCompletedByUserInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => TaskCreateManyCompletedByUserInputObjectSchema), z.lazy(() => TaskCreateManyCompletedByUserInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const TaskCreateManyCompletedByUserInputEnvelopeObjectSchema: z.ZodType<Prisma.TaskCreateManyCompletedByUserInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.TaskCreateManyCompletedByUserInputEnvelope>;
export const TaskCreateManyCompletedByUserInputEnvelopeObjectZodSchema = makeSchema();
