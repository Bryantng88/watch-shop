import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  technicalIssues: z.boolean().optional()
}).strict();
export const TechnicalDetailCatalogCountOutputTypeSelectObjectSchema: z.ZodType<Prisma.TechnicalDetailCatalogCountOutputTypeSelect> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalDetailCatalogCountOutputTypeSelect>;
export const TechnicalDetailCatalogCountOutputTypeSelectObjectZodSchema = makeSchema();
