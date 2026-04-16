import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalIssueCreateManyVendorInputObjectSchema as TechnicalIssueCreateManyVendorInputObjectSchema } from './TechnicalIssueCreateManyVendorInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => TechnicalIssueCreateManyVendorInputObjectSchema), z.lazy(() => TechnicalIssueCreateManyVendorInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const TechnicalIssueCreateManyVendorInputEnvelopeObjectSchema: z.ZodType<Prisma.TechnicalIssueCreateManyVendorInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalIssueCreateManyVendorInputEnvelope>;
export const TechnicalIssueCreateManyVendorInputEnvelopeObjectZodSchema = makeSchema();
