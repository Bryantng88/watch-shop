import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  AcquisitionItem: z.boolean().optional(),
  InvoiceItem: z.boolean().optional(),
  MaintenancePart: z.boolean().optional(),
  MaintenanceRecord: z.boolean().optional(),
  ServiceRequest: z.boolean().optional()
}).strict();
export const ProductVariantCountOutputTypeSelectObjectSchema: z.ZodType<Prisma.ProductVariantCountOutputTypeSelect> = makeSchema() as unknown as z.ZodType<Prisma.ProductVariantCountOutputTypeSelect>;
export const ProductVariantCountOutputTypeSelectObjectZodSchema = makeSchema();
