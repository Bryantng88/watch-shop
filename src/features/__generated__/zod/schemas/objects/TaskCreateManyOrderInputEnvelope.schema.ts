import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskCreateManyOrderInputObjectSchema as TaskCreateManyOrderInputObjectSchema } from './TaskCreateManyOrderInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => TaskCreateManyOrderInputObjectSchema), z.lazy(() => TaskCreateManyOrderInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const TaskCreateManyOrderInputEnvelopeObjectSchema: z.ZodType<Prisma.TaskCreateManyOrderInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.TaskCreateManyOrderInputEnvelope>;
export const TaskCreateManyOrderInputEnvelopeObjectZodSchema = makeSchema();
