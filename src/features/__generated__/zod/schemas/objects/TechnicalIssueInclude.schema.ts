import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalAssessmentArgsObjectSchema as TechnicalAssessmentArgsObjectSchema } from './TechnicalAssessmentArgs.schema';
import { ServiceCatalogArgsObjectSchema as ServiceCatalogArgsObjectSchema } from './ServiceCatalogArgs.schema';
import { SupplyCatalogArgsObjectSchema as SupplyCatalogArgsObjectSchema } from './SupplyCatalogArgs.schema'

const makeSchema = () => z.object({
  TechnicalAssessment: z.union([z.boolean(), z.lazy(() => TechnicalAssessmentArgsObjectSchema)]).optional(),
  ServiceCatalog: z.union([z.boolean(), z.lazy(() => ServiceCatalogArgsObjectSchema)]).optional(),
  SupplyCatalog: z.union([z.boolean(), z.lazy(() => SupplyCatalogArgsObjectSchema)]).optional()
}).strict();
export const TechnicalIssueIncludeObjectSchema: z.ZodType<Prisma.TechnicalIssueInclude> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalIssueInclude>;
export const TechnicalIssueIncludeObjectZodSchema = makeSchema();
