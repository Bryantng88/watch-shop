import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  TechnicalIssue: z.boolean().optional()
}).strict();
export const MechanicalPartCatalogCountOutputTypeSelectObjectSchema: z.ZodType<Prisma.MechanicalPartCatalogCountOutputTypeSelect> = makeSchema() as unknown as z.ZodType<Prisma.MechanicalPartCatalogCountOutputTypeSelect>;
export const MechanicalPartCatalogCountOutputTypeSelectObjectZodSchema = makeSchema();
