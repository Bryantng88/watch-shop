import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  OrderItem: z.boolean().optional(),
  ServiceRequest: z.boolean().optional()
}).strict();
export const ServiceCatalogCountOutputTypeSelectObjectSchema: z.ZodType<Prisma.ServiceCatalogCountOutputTypeSelect> = makeSchema() as unknown as z.ZodType<Prisma.ServiceCatalogCountOutputTypeSelect>;
export const ServiceCatalogCountOutputTypeSelectObjectZodSchema = makeSchema();
