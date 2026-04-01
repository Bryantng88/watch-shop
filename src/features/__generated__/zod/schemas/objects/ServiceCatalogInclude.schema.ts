import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderItemFindManySchema as OrderItemFindManySchema } from '../findManyOrderItem.schema';
import { MaintenanceRecordArgsObjectSchema as MaintenanceRecordArgsObjectSchema } from './MaintenanceRecordArgs.schema';
import { ServiceRequestFindManySchema as ServiceRequestFindManySchema } from '../findManyServiceRequest.schema';
import { TechnicalIssueFindManySchema as TechnicalIssueFindManySchema } from '../findManyTechnicalIssue.schema';
import { ServiceCatalogCountOutputTypeArgsObjectSchema as ServiceCatalogCountOutputTypeArgsObjectSchema } from './ServiceCatalogCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  OrderItem: z.union([z.boolean(), z.lazy(() => OrderItemFindManySchema)]).optional(),
  maintenanceRecord: z.union([z.boolean(), z.lazy(() => MaintenanceRecordArgsObjectSchema)]).optional(),
  ServiceRequest: z.union([z.boolean(), z.lazy(() => ServiceRequestFindManySchema)]).optional(),
  TechnicalIssue: z.union([z.boolean(), z.lazy(() => TechnicalIssueFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => ServiceCatalogCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const ServiceCatalogIncludeObjectSchema: z.ZodType<Prisma.ServiceCatalogInclude> = makeSchema() as unknown as z.ZodType<Prisma.ServiceCatalogInclude>;
export const ServiceCatalogIncludeObjectZodSchema = makeSchema();
