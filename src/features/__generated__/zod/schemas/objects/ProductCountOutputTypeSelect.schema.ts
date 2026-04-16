import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  AcquisitionItem: z.boolean().optional(),
  AcquisitionSpecJob: z.boolean().optional(),
  InvoiceItem: z.boolean().optional(),
  MaintenanceRecord: z.boolean().optional(),
  OrderItem: z.boolean().optional(),
  productImage: z.boolean().optional(),
  productVariant: z.boolean().optional(),
  reservation: z.boolean().optional(),
  serviceRequest: z.boolean().optional()
}).strict();
export const ProductCountOutputTypeSelectObjectSchema: z.ZodType<Prisma.ProductCountOutputTypeSelect> = makeSchema() as unknown as z.ZodType<Prisma.ProductCountOutputTypeSelect>;
export const ProductCountOutputTypeSelectObjectZodSchema = makeSchema();
