import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  acquisitionItem: z.boolean().optional(),
  invoiceItem: z.boolean().optional(),
  maintenancePart: z.boolean().optional(),
  maintenanceRecord: z.boolean().optional(),
  serviceRequest: z.boolean().optional()
}).strict();
export const ProductVariantCountOutputTypeSelectObjectSchema: z.ZodType<Prisma.ProductVariantCountOutputTypeSelect> = makeSchema() as unknown as z.ZodType<Prisma.ProductVariantCountOutputTypeSelect>;
export const ProductVariantCountOutputTypeSelectObjectZodSchema = makeSchema();
