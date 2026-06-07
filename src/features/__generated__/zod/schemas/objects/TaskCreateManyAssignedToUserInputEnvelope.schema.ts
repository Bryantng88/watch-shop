import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskCreateManyAssignedToUserInputObjectSchema as TaskCreateManyAssignedToUserInputObjectSchema } from './TaskCreateManyAssignedToUserInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => TaskCreateManyAssignedToUserInputObjectSchema), z.lazy(() => TaskCreateManyAssignedToUserInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const TaskCreateManyAssignedToUserInputEnvelopeObjectSchema: z.ZodType<Prisma.TaskCreateManyAssignedToUserInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.TaskCreateManyAssignedToUserInputEnvelope>;
export const TaskCreateManyAssignedToUserInputEnvelopeObjectZodSchema = makeSchema();
