import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  acquisitionItem: z.boolean().optional(),
  acquisitionSpecJob: z.boolean().optional(),
  invoiceItem: z.boolean().optional(),
  maintenanceRecord: z.boolean().optional(),
  orderItem: z.boolean().optional(),
  productImage: z.boolean().optional(),
  productVariant: z.boolean().optional(),
  reservation: z.boolean().optional(),
  serviceRequest: z.boolean().optional()
}).strict();
export const ProductCountOutputTypeSelectObjectSchema: z.ZodType<Prisma.ProductCountOutputTypeSelect> = makeSchema() as unknown as z.ZodType<Prisma.ProductCountOutputTypeSelect>;
export const ProductCountOutputTypeSelectObjectZodSchema = makeSchema();
