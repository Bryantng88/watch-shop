import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkCaseCreateManyRaisedByUserInputObjectSchema as WorkCaseCreateManyRaisedByUserInputObjectSchema } from './WorkCaseCreateManyRaisedByUserInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => WorkCaseCreateManyRaisedByUserInputObjectSchema), z.lazy(() => WorkCaseCreateManyRaisedByUserInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const WorkCaseCreateManyRaisedByUserInputEnvelopeObjectSchema: z.ZodType<Prisma.WorkCaseCreateManyRaisedByUserInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseCreateManyRaisedByUserInputEnvelope>;
export const WorkCaseCreateManyRaisedByUserInputEnvelopeObjectZodSchema = makeSchema();
