import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderItemFindManySchema as OrderItemFindManySchema } from '../findManyOrderItem.schema';
import { MaintenanceRecordArgsObjectSchema as MaintenanceRecordArgsObjectSchema } from './MaintenanceRecordArgs.schema';
import { ServiceRequestFindManySchema as ServiceRequestFindManySchema } from '../findManyServiceRequest.schema';
import { ServiceCatalogCountOutputTypeArgsObjectSchema as ServiceCatalogCountOutputTypeArgsObjectSchema } from './ServiceCatalogCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  code: z.boolean().optional(),
  name: z.boolean().optional(),
  description: z.boolean().optional(),
  defaultPrice: z.boolean().optional(),
  durationMin: z.boolean().optional(),
  isActive: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  maintenanceRecordId: z.boolean().optional(),
  detail: z.boolean().optional(),
  OrderItem: z.union([z.boolean(), z.lazy(() => OrderItemFindManySchema)]).optional(),
  maintenanceRecord: z.union([z.boolean(), z.lazy(() => MaintenanceRecordArgsObjectSchema)]).optional(),
  ServiceRequest: z.union([z.boolean(), z.lazy(() => ServiceRequestFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => ServiceCatalogCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const ServiceCatalogSelectObjectSchema: z.ZodType<Prisma.ServiceCatalogSelect> = makeSchema() as unknown as z.ZodType<Prisma.ServiceCatalogSelect>;
export const ServiceCatalogSelectObjectZodSchema = makeSchema();
