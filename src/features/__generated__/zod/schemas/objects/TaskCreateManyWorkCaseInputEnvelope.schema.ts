import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskCreateManyWorkCaseInputObjectSchema as TaskCreateManyWorkCaseInputObjectSchema } from './TaskCreateManyWorkCaseInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => TaskCreateManyWorkCaseInputObjectSchema), z.lazy(() => TaskCreateManyWorkCaseInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const TaskCreateManyWorkCaseInputEnvelopeObjectSchema: z.ZodType<Prisma.TaskCreateManyWorkCaseInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.TaskCreateManyWorkCaseInputEnvelope>;
export const TaskCreateManyWorkCaseInputEnvelopeObjectZodSchema = makeSchema();
