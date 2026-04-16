import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  MaintenanceRecord: z.boolean().optional()
}).strict();
export const TechnicalIssueCountOutputTypeSelectObjectSchema: z.ZodType<Prisma.TechnicalIssueCountOutputTypeSelect> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalIssueCountOutputTypeSelect>;
export const TechnicalIssueCountOutputTypeSelectObjectZodSchema = makeSchema();
