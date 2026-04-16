import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalIssueCreateManyUserInputObjectSchema as TechnicalIssueCreateManyUserInputObjectSchema } from './TechnicalIssueCreateManyUserInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => TechnicalIssueCreateManyUserInputObjectSchema), z.lazy(() => TechnicalIssueCreateManyUserInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const TechnicalIssueCreateManyUserInputEnvelopeObjectSchema: z.ZodType<Prisma.TechnicalIssueCreateManyUserInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalIssueCreateManyUserInputEnvelope>;
export const TechnicalIssueCreateManyUserInputEnvelopeObjectZodSchema = makeSchema();
