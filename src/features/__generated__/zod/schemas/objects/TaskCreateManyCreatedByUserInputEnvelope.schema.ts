import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskCreateManyCreatedByUserInputObjectSchema as TaskCreateManyCreatedByUserInputObjectSchema } from './TaskCreateManyCreatedByUserInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => TaskCreateManyCreatedByUserInputObjectSchema), z.lazy(() => TaskCreateManyCreatedByUserInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const TaskCreateManyCreatedByUserInputEnvelopeObjectSchema: z.ZodType<Prisma.TaskCreateManyCreatedByUserInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.TaskCreateManyCreatedByUserInputEnvelope>;
export const TaskCreateManyCreatedByUserInputEnvelopeObjectZodSchema = makeSchema();
