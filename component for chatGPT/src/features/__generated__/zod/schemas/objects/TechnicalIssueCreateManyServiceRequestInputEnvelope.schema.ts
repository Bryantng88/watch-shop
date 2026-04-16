import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalIssueCreateManyServiceRequestInputObjectSchema as TechnicalIssueCreateManyServiceRequestInputObjectSchema } from './TechnicalIssueCreateManyServiceRequestInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => TechnicalIssueCreateManyServiceRequestInputObjectSchema), z.lazy(() => TechnicalIssueCreateManyServiceRequestInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const TechnicalIssueCreateManyServiceRequestInputEnvelopeObjectSchema: z.ZodType<Prisma.TechnicalIssueCreateManyServiceRequestInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalIssueCreateManyServiceRequestInputEnvelope>;
export const TechnicalIssueCreateManyServiceRequestInputEnvelopeObjectZodSchema = makeSchema();
