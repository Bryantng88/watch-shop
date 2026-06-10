import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkCaseCreateManyCategoryInputObjectSchema as WorkCaseCreateManyCategoryInputObjectSchema } from './WorkCaseCreateManyCategoryInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => WorkCaseCreateManyCategoryInputObjectSchema), z.lazy(() => WorkCaseCreateManyCategoryInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const WorkCaseCreateManyCategoryInputEnvelopeObjectSchema: z.ZodType<Prisma.WorkCaseCreateManyCategoryInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseCreateManyCategoryInputEnvelope>;
export const WorkCaseCreateManyCategoryInputEnvelopeObjectZodSchema = makeSchema();
