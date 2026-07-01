import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskItemActivityReplyCreateManyActivityInputObjectSchema as TaskItemActivityReplyCreateManyActivityInputObjectSchema } from './TaskItemActivityReplyCreateManyActivityInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => TaskItemActivityReplyCreateManyActivityInputObjectSchema), z.lazy(() => TaskItemActivityReplyCreateManyActivityInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const TaskItemActivityReplyCreateManyActivityInputEnvelopeObjectSchema: z.ZodType<Prisma.TaskItemActivityReplyCreateManyActivityInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemActivityReplyCreateManyActivityInputEnvelope>;
export const TaskItemActivityReplyCreateManyActivityInputEnvelopeObjectZodSchema = makeSchema();
