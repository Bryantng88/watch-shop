import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskItemActivityCreateManyTaskItemInputObjectSchema as TaskItemActivityCreateManyTaskItemInputObjectSchema } from './TaskItemActivityCreateManyTaskItemInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => TaskItemActivityCreateManyTaskItemInputObjectSchema), z.lazy(() => TaskItemActivityCreateManyTaskItemInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const TaskItemActivityCreateManyTaskItemInputEnvelopeObjectSchema: z.ZodType<Prisma.TaskItemActivityCreateManyTaskItemInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemActivityCreateManyTaskItemInputEnvelope>;
export const TaskItemActivityCreateManyTaskItemInputEnvelopeObjectZodSchema = makeSchema();
