import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PaymentCreateManyTechnicalIssueInputObjectSchema as PaymentCreateManyTechnicalIssueInputObjectSchema } from './PaymentCreateManyTechnicalIssueInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => PaymentCreateManyTechnicalIssueInputObjectSchema), z.lazy(() => PaymentCreateManyTechnicalIssueInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const PaymentCreateManyTechnicalIssueInputEnvelopeObjectSchema: z.ZodType<Prisma.PaymentCreateManyTechnicalIssueInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.PaymentCreateManyTechnicalIssueInputEnvelope>;
export const PaymentCreateManyTechnicalIssueInputEnvelopeObjectZodSchema = makeSchema();
