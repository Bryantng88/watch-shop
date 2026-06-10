import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkCaseCreateManyAssignedToUserInputObjectSchema as WorkCaseCreateManyAssignedToUserInputObjectSchema } from './WorkCaseCreateManyAssignedToUserInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => WorkCaseCreateManyAssignedToUserInputObjectSchema), z.lazy(() => WorkCaseCreateManyAssignedToUserInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const WorkCaseCreateManyAssignedToUserInputEnvelopeObjectSchema: z.ZodType<Prisma.WorkCaseCreateManyAssignedToUserInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseCreateManyAssignedToUserInputEnvelope>;
export const WorkCaseCreateManyAssignedToUserInputEnvelopeObjectZodSchema = makeSchema();
