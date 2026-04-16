import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenancePartFindManySchema as MaintenancePartFindManySchema } from '../findManyMaintenancePart.schema';
import { PaymentArgsObjectSchema as PaymentArgsObjectSchema } from './PaymentArgs.schema';
import { ProductArgsObjectSchema as ProductArgsObjectSchema } from './ProductArgs.schema';
import { ServiceCatalogArgsObjectSchema as ServiceCatalogArgsObjectSchema } from './ServiceCatalogArgs.schema';
import { ServiceRequestArgsObjectSchema as ServiceRequestArgsObjectSchema } from './ServiceRequestArgs.schema';
import { TechnicalIssueArgsObjectSchema as TechnicalIssueArgsObjectSchema } from './TechnicalIssueArgs.schema';
import { UserArgsObjectSchema as UserArgsObjectSchema } from './UserArgs.schema';
import { ProductVariantArgsObjectSchema as ProductVariantArgsObjectSchema } from './ProductVariantArgs.schema';
import { VendorArgsObjectSchema as VendorArgsObjectSchema } from './VendorArgs.schema';
import { MaintenanceRecordCountOutputTypeArgsObjectSchema as MaintenanceRecordCountOutputTypeArgsObjectSchema } from './MaintenanceRecordCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  MaintenancePart: z.union([z.boolean(), z.lazy(() => MaintenancePartFindManySchema)]).optional(),
  Payment: z.union([z.boolean(), z.lazy(() => PaymentArgsObjectSchema)]).optional(),
  Product: z.union([z.boolean(), z.lazy(() => ProductArgsObjectSchema)]).optional(),
  serviceCatalog: z.union([z.boolean(), z.lazy(() => ServiceCatalogArgsObjectSchema)]).optional(),
  ServiceRequest: z.union([z.boolean(), z.lazy(() => ServiceRequestArgsObjectSchema)]).optional(),
  TechnicalIssue: z.union([z.boolean(), z.lazy(() => TechnicalIssueArgsObjectSchema)]).optional(),
  User: z.union([z.boolean(), z.lazy(() => UserArgsObjectSchema)]).optional(),
  ProductVariant: z.union([z.boolean(), z.lazy(() => ProductVariantArgsObjectSchema)]).optional(),
  Vendor: z.union([z.boolean(), z.lazy(() => VendorArgsObjectSchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => MaintenanceRecordCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const MaintenanceRecordIncludeObjectSchema: z.ZodType<Prisma.MaintenanceRecordInclude> = makeSchema() as unknown as z.ZodType<Prisma.MaintenanceRecordInclude>;
export const MaintenanceRecordIncludeObjectZodSchema = makeSchema();
