import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  Acquisition: z.boolean().optional(),
  Invoice: z.boolean().optional(),
  MaintenanceRecord: z.boolean().optional(),
  product: z.boolean().optional(),
  serviceRequest: z.boolean().optional(),
  technicalAssessment: z.boolean().optional(),
  technicalIssue: z.boolean().optional()
}).strict();
export const VendorCountOutputTypeSelectObjectSchema: z.ZodType<Prisma.VendorCountOutputTypeSelect> = makeSchema() as unknown as z.ZodType<Prisma.VendorCountOutputTypeSelect>;
export const VendorCountOutputTypeSelectObjectZodSchema = makeSchema();
