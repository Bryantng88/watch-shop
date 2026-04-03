import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  approvalRequests: z.boolean().optional(),
  maintenanceLogs: z.boolean().optional()
}).strict();
export const TechnicalAssessmentsCountOutputTypeSelectObjectSchema: z.ZodType<Prisma.TechnicalAssessmentsCountOutputTypeSelect> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalAssessmentsCountOutputTypeSelect>;
export const TechnicalAssessmentsCountOutputTypeSelectObjectZodSchema = makeSchema();
