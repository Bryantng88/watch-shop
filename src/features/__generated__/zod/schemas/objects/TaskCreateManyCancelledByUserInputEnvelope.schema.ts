import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskCreateManyCancelledByUserInputObjectSchema as TaskCreateManyCancelledByUserInputObjectSchema } from './TaskCreateManyCancelledByUserInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => TaskCreateManyCancelledByUserInputObjectSchema), z.lazy(() => TaskCreateManyCancelledByUserInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const TaskCreateManyCancelledByUserInputEnvelopeObjectSchema: z.ZodType<Prisma.TaskCreateManyCancelledByUserInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.TaskCreateManyCancelledByUserInputEnvelope>;
export const TaskCreateManyCancelledByUserInputEnvelopeObjectZodSchema = makeSchema();
