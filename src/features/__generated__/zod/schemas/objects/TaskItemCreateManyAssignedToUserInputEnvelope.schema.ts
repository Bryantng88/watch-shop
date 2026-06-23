import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskItemCreateManyAssignedToUserInputObjectSchema as TaskItemCreateManyAssignedToUserInputObjectSchema } from './TaskItemCreateManyAssignedToUserInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => TaskItemCreateManyAssignedToUserInputObjectSchema), z.lazy(() => TaskItemCreateManyAssignedToUserInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const TaskItemCreateManyAssignedToUserInputEnvelopeObjectSchema: z.ZodType<Prisma.TaskItemCreateManyAssignedToUserInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemCreateManyAssignedToUserInputEnvelope>;
export const TaskItemCreateManyAssignedToUserInputEnvelopeObjectZodSchema = makeSchema();
