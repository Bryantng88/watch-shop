import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskCreateManyWatchInputObjectSchema as TaskCreateManyWatchInputObjectSchema } from './TaskCreateManyWatchInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => TaskCreateManyWatchInputObjectSchema), z.lazy(() => TaskCreateManyWatchInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const TaskCreateManyWatchInputEnvelopeObjectSchema: z.ZodType<Prisma.TaskCreateManyWatchInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.TaskCreateManyWatchInputEnvelope>;
export const TaskCreateManyWatchInputEnvelopeObjectZodSchema = makeSchema();
