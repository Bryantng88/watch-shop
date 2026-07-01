import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskItemActivityReplyCreateManyActorUserInputObjectSchema as TaskItemActivityReplyCreateManyActorUserInputObjectSchema } from './TaskItemActivityReplyCreateManyActorUserInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => TaskItemActivityReplyCreateManyActorUserInputObjectSchema), z.lazy(() => TaskItemActivityReplyCreateManyActorUserInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const TaskItemActivityReplyCreateManyActorUserInputEnvelopeObjectSchema: z.ZodType<Prisma.TaskItemActivityReplyCreateManyActorUserInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemActivityReplyCreateManyActorUserInputEnvelope>;
export const TaskItemActivityReplyCreateManyActorUserInputEnvelopeObjectZodSchema = makeSchema();
