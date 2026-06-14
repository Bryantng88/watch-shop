import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskActionCreateManyTaskTypeInputObjectSchema as TaskActionCreateManyTaskTypeInputObjectSchema } from './TaskActionCreateManyTaskTypeInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => TaskActionCreateManyTaskTypeInputObjectSchema), z.lazy(() => TaskActionCreateManyTaskTypeInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const TaskActionCreateManyTaskTypeInputEnvelopeObjectSchema: z.ZodType<Prisma.TaskActionCreateManyTaskTypeInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.TaskActionCreateManyTaskTypeInputEnvelope>;
export const TaskActionCreateManyTaskTypeInputEnvelopeObjectZodSchema = makeSchema();
