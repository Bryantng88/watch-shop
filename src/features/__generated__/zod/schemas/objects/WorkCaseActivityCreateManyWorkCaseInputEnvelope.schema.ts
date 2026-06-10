import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkCaseActivityCreateManyWorkCaseInputObjectSchema as WorkCaseActivityCreateManyWorkCaseInputObjectSchema } from './WorkCaseActivityCreateManyWorkCaseInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => WorkCaseActivityCreateManyWorkCaseInputObjectSchema), z.lazy(() => WorkCaseActivityCreateManyWorkCaseInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const WorkCaseActivityCreateManyWorkCaseInputEnvelopeObjectSchema: z.ZodType<Prisma.WorkCaseActivityCreateManyWorkCaseInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseActivityCreateManyWorkCaseInputEnvelope>;
export const WorkCaseActivityCreateManyWorkCaseInputEnvelopeObjectZodSchema = makeSchema();
