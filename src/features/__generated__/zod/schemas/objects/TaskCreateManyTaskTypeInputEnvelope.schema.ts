import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskCreateManyTaskTypeInputObjectSchema as TaskCreateManyTaskTypeInputObjectSchema } from './TaskCreateManyTaskTypeInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => TaskCreateManyTaskTypeInputObjectSchema), z.lazy(() => TaskCreateManyTaskTypeInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const TaskCreateManyTaskTypeInputEnvelopeObjectSchema: z.ZodType<Prisma.TaskCreateManyTaskTypeInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.TaskCreateManyTaskTypeInputEnvelope>;
export const TaskCreateManyTaskTypeInputEnvelopeObjectZodSchema = makeSchema();
