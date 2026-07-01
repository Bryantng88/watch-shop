import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskItemActivityCreateManyActorUserInputObjectSchema as TaskItemActivityCreateManyActorUserInputObjectSchema } from './TaskItemActivityCreateManyActorUserInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => TaskItemActivityCreateManyActorUserInputObjectSchema), z.lazy(() => TaskItemActivityCreateManyActorUserInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const TaskItemActivityCreateManyActorUserInputEnvelopeObjectSchema: z.ZodType<Prisma.TaskItemActivityCreateManyActorUserInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemActivityCreateManyActorUserInputEnvelope>;
export const TaskItemActivityCreateManyActorUserInputEnvelopeObjectZodSchema = makeSchema();
