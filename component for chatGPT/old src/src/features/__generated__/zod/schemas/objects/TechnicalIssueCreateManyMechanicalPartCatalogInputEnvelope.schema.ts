import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalIssueCreateManyMechanicalPartCatalogInputObjectSchema as TechnicalIssueCreateManyMechanicalPartCatalogInputObjectSchema } from './TechnicalIssueCreateManyMechanicalPartCatalogInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => TechnicalIssueCreateManyMechanicalPartCatalogInputObjectSchema), z.lazy(() => TechnicalIssueCreateManyMechanicalPartCatalogInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const TechnicalIssueCreateManyMechanicalPartCatalogInputEnvelopeObjectSchema: z.ZodType<Prisma.TechnicalIssueCreateManyMechanicalPartCatalogInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalIssueCreateManyMechanicalPartCatalogInputEnvelope>;
export const TechnicalIssueCreateManyMechanicalPartCatalogInputEnvelopeObjectZodSchema = makeSchema();
