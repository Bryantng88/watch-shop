import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalIssueCreateManyServiceCatalogInputObjectSchema as TechnicalIssueCreateManyServiceCatalogInputObjectSchema } from './TechnicalIssueCreateManyServiceCatalogInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => TechnicalIssueCreateManyServiceCatalogInputObjectSchema), z.lazy(() => TechnicalIssueCreateManyServiceCatalogInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const TechnicalIssueCreateManyServiceCatalogInputEnvelopeObjectSchema: z.ZodType<Prisma.TechnicalIssueCreateManyServiceCatalogInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalIssueCreateManyServiceCatalogInputEnvelope>;
export const TechnicalIssueCreateManyServiceCatalogInputEnvelopeObjectZodSchema = makeSchema();
