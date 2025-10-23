import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  AcquisitionItem: z.boolean().optional(),
  InvoiceItem: z.boolean().optional(),
  maintenanceRecords: z.boolean().optional(),
  orderItems: z.boolean().optional(),
  image: z.boolean().optional(),
  variants: z.boolean().optional(),
  Reservation: z.boolean().optional(),
  ServiceRequest: z.boolean().optional()
}).strict();
export const ProductCountOutputTypeSelectObjectSchema: z.ZodType<Prisma.ProductCountOutputTypeSelect> = makeSchema() as unknown as z.ZodType<Prisma.ProductCountOutputTypeSelect>;
export const ProductCountOutputTypeSelectObjectZodSchema = makeSchema();
