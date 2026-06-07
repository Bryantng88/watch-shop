import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskCreateManyAcquisitionInputObjectSchema as TaskCreateManyAcquisitionInputObjectSchema } from './TaskCreateManyAcquisitionInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => TaskCreateManyAcquisitionInputObjectSchema), z.lazy(() => TaskCreateManyAcquisitionInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const TaskCreateManyAcquisitionInputEnvelopeObjectSchema: z.ZodType<Prisma.TaskCreateManyAcquisitionInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.TaskCreateManyAcquisitionInputEnvelope>;
export const TaskCreateManyAcquisitionInputEnvelopeObjectZodSchema = makeSchema();
