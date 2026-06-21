import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  maintenanceRecord: z.boolean().optional(),
  orderItem: z.boolean().optional(),
  serviceRequest: z.boolean().optional(),
  technicalIssue: z.boolean().optional()
}).strict();
export const ServiceCatalogCountOutputTypeSelectObjectSchema: z.ZodType<Prisma.ServiceCatalogCountOutputTypeSelect> = makeSchema() as unknown as z.ZodType<Prisma.ServiceCatalogCountOutputTypeSelect>;
export const ServiceCatalogCountOutputTypeSelectObjectZodSchema = makeSchema();
