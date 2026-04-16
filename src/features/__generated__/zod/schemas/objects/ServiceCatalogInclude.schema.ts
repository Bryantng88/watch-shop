import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenanceRecordFindManySchema as MaintenanceRecordFindManySchema } from '../findManyMaintenanceRecord.schema';
import { OrderItemFindManySchema as OrderItemFindManySchema } from '../findManyOrderItem.schema';
import { ServiceRequestFindManySchema as ServiceRequestFindManySchema } from '../findManyServiceRequest.schema';
import { TechnicalIssueFindManySchema as TechnicalIssueFindManySchema } from '../findManyTechnicalIssue.schema';
import { ServiceCatalogCountOutputTypeArgsObjectSchema as ServiceCatalogCountOutputTypeArgsObjectSchema } from './ServiceCatalogCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  MaintenanceRecord: z.union([z.boolean(), z.lazy(() => MaintenanceRecordFindManySchema)]).optional(),
  OrderItem: z.union([z.boolean(), z.lazy(() => OrderItemFindManySchema)]).optional(),
  ServiceRequest: z.union([z.boolean(), z.lazy(() => ServiceRequestFindManySchema)]).optional(),
  TechnicalIssue: z.union([z.boolean(), z.lazy(() => TechnicalIssueFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => ServiceCatalogCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const ServiceCatalogIncludeObjectSchema: z.ZodType<Prisma.ServiceCatalogInclude> = makeSchema() as unknown as z.ZodType<Prisma.ServiceCatalogInclude>;
export const ServiceCatalogIncludeObjectZodSchema = makeSchema();
