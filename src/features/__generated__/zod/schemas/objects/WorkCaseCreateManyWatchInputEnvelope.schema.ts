import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkCaseCreateManyWatchInputObjectSchema as WorkCaseCreateManyWatchInputObjectSchema } from './WorkCaseCreateManyWatchInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => WorkCaseCreateManyWatchInputObjectSchema), z.lazy(() => WorkCaseCreateManyWatchInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const WorkCaseCreateManyWatchInputEnvelopeObjectSchema: z.ZodType<Prisma.WorkCaseCreateManyWatchInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseCreateManyWatchInputEnvelope>;
export const WorkCaseCreateManyWatchInputEnvelopeObjectZodSchema = makeSchema();
