import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalIssueCreateManySupplyCatalogInputObjectSchema as TechnicalIssueCreateManySupplyCatalogInputObjectSchema } from './TechnicalIssueCreateManySupplyCatalogInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => TechnicalIssueCreateManySupplyCatalogInputObjectSchema), z.lazy(() => TechnicalIssueCreateManySupplyCatalogInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const TechnicalIssueCreateManySupplyCatalogInputEnvelopeObjectSchema: z.ZodType<Prisma.TechnicalIssueCreateManySupplyCatalogInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalIssueCreateManySupplyCatalogInputEnvelope>;
export const TechnicalIssueCreateManySupplyCatalogInputEnvelopeObjectZodSchema = makeSchema();
