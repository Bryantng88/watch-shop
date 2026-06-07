import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskCreateManyServiceRequestInputObjectSchema as TaskCreateManyServiceRequestInputObjectSchema } from './TaskCreateManyServiceRequestInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => TaskCreateManyServiceRequestInputObjectSchema), z.lazy(() => TaskCreateManyServiceRequestInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const TaskCreateManyServiceRequestInputEnvelopeObjectSchema: z.ZodType<Prisma.TaskCreateManyServiceRequestInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.TaskCreateManyServiceRequestInputEnvelope>;
export const TaskCreateManyServiceRequestInputEnvelopeObjectZodSchema = makeSchema();
