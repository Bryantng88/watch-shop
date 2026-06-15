import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkCaseCreateManyOrderInputObjectSchema as WorkCaseCreateManyOrderInputObjectSchema } from './WorkCaseCreateManyOrderInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => WorkCaseCreateManyOrderInputObjectSchema), z.lazy(() => WorkCaseCreateManyOrderInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const WorkCaseCreateManyOrderInputEnvelopeObjectSchema: z.ZodType<Prisma.WorkCaseCreateManyOrderInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseCreateManyOrderInputEnvelope>;
export const WorkCaseCreateManyOrderInputEnvelopeObjectZodSchema = makeSchema();
