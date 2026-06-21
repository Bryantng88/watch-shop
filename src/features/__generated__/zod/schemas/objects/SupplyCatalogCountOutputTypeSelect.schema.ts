import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  TechnicalIssue: z.boolean().optional()
}).strict();
export const SupplyCatalogCountOutputTypeSelectObjectSchema: z.ZodType<Prisma.SupplyCatalogCountOutputTypeSelect> = makeSchema() as unknown as z.ZodType<Prisma.SupplyCatalogCountOutputTypeSelect>;
export const SupplyCatalogCountOutputTypeSelectObjectZodSchema = makeSchema();
