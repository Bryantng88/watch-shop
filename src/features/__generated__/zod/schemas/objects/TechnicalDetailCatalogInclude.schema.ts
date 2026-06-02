import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalIssueFindManySchema as TechnicalIssueFindManySchema } from '../findManyTechnicalIssue.schema';
import { TechnicalDetailCatalogCountOutputTypeArgsObjectSchema as TechnicalDetailCatalogCountOutputTypeArgsObjectSchema } from './TechnicalDetailCatalogCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  technicalIssues: z.union([z.boolean(), z.lazy(() => TechnicalIssueFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => TechnicalDetailCatalogCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const TechnicalDetailCatalogIncludeObjectSchema: z.ZodType<Prisma.TechnicalDetailCatalogInclude> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalDetailCatalogInclude>;
export const TechnicalDetailCatalogIncludeObjectZodSchema = makeSchema();
