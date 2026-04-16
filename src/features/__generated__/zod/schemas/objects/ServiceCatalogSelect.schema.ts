import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenanceRecordFindManySchema as MaintenanceRecordFindManySchema } from '../findManyMaintenanceRecord.schema';
import { OrderItemFindManySchema as OrderItemFindManySchema } from '../findManyOrderItem.schema';
import { ServiceRequestFindManySchema as ServiceRequestFindManySchema } from '../findManyServiceRequest.schema';
import { TechnicalIssueFindManySchema as TechnicalIssueFindManySchema } from '../findManyTechnicalIssue.schema';
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
  detail: z.boolean().optional(),
  vendorPrice: z.boolean().optional(),
  customerPrice: z.boolean().optional(),
  internalCost: z.boolean().optional(),
  note: z.boolean().optional(),
  categoryKey: z.boolean().optional(),
  sortOrder: z.boolean().optional(),
  MaintenanceRecord: z.union([z.boolean(), z.lazy(() => MaintenanceRecordFindManySchema)]).optional(),
  OrderItem: z.union([z.boolean(), z.lazy(() => OrderItemFindManySchema)]).optional(),
  ServiceRequest: z.union([z.boolean(), z.lazy(() => ServiceRequestFindManySchema)]).optional(),
  TechnicalIssue: z.union([z.boolean(), z.lazy(() => TechnicalIssueFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => ServiceCatalogCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const ServiceCatalogSelectObjectSchema: z.ZodType<Prisma.ServiceCatalogSelect> = makeSchema() as unknown as z.ZodType<Prisma.ServiceCatalogSelect>;
export const ServiceCatalogSelectObjectZodSchema = makeSchema();
