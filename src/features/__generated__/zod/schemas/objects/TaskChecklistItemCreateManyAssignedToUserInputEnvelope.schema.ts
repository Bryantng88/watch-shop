import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskChecklistItemCreateManyAssignedToUserInputObjectSchema as TaskChecklistItemCreateManyAssignedToUserInputObjectSchema } from './TaskChecklistItemCreateManyAssignedToUserInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => TaskChecklistItemCreateManyAssignedToUserInputObjectSchema), z.lazy(() => TaskChecklistItemCreateManyAssignedToUserInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const TaskChecklistItemCreateManyAssignedToUserInputEnvelopeObjectSchema: z.ZodType<Prisma.TaskChecklistItemCreateManyAssignedToUserInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.TaskChecklistItemCreateManyAssignedToUserInputEnvelope>;
export const TaskChecklistItemCreateManyAssignedToUserInputEnvelopeObjectZodSchema = makeSchema();
