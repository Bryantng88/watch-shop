import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalIssueCreateManyTechnicalDetailCatalogInputObjectSchema as TechnicalIssueCreateManyTechnicalDetailCatalogInputObjectSchema } from './TechnicalIssueCreateManyTechnicalDetailCatalogInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => TechnicalIssueCreateManyTechnicalDetailCatalogInputObjectSchema), z.lazy(() => TechnicalIssueCreateManyTechnicalDetailCatalogInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const TechnicalIssueCreateManyTechnicalDetailCatalogInputEnvelopeObjectSchema: z.ZodType<Prisma.TechnicalIssueCreateManyTechnicalDetailCatalogInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalIssueCreateManyTechnicalDetailCatalogInputEnvelope>;
export const TechnicalIssueCreateManyTechnicalDetailCatalogInputEnvelopeObjectZodSchema = makeSchema();
