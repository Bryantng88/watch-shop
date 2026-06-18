import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskExecutionCreateManyServiceRequestInputObjectSchema as TaskExecutionCreateManyServiceRequestInputObjectSchema } from './TaskExecutionCreateManyServiceRequestInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => TaskExecutionCreateManyServiceRequestInputObjectSchema), z.lazy(() => TaskExecutionCreateManyServiceRequestInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const TaskExecutionCreateManyServiceRequestInputEnvelopeObjectSchema: z.ZodType<Prisma.TaskExecutionCreateManyServiceRequestInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.TaskExecutionCreateManyServiceRequestInputEnvelope>;
export const TaskExecutionCreateManyServiceRequestInputEnvelopeObjectZodSchema = makeSchema();
