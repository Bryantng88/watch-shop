import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenancePartFindManySchema as MaintenancePartFindManySchema } from '../findManyMaintenancePart.schema';
import { ProductArgsObjectSchema as ProductArgsObjectSchema } from './ProductArgs.schema';
import { ServiceRequestArgsObjectSchema as ServiceRequestArgsObjectSchema } from './ServiceRequestArgs.schema';
import { ProductVariantArgsObjectSchema as ProductVariantArgsObjectSchema } from './ProductVariantArgs.schema';
import { VendorArgsObjectSchema as VendorArgsObjectSchema } from './VendorArgs.schema';
import { ServiceCatalogFindManySchema as ServiceCatalogFindManySchema } from '../findManyServiceCatalog.schema';
import { MaintenanceRecordCountOutputTypeArgsObjectSchema as MaintenanceRecordCountOutputTypeArgsObjectSchema } from './MaintenanceRecordCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  parts: z.union([z.boolean(), z.lazy(() => MaintenancePartFindManySchema)]).optional(),
  product: z.union([z.boolean(), z.lazy(() => ProductArgsObjectSchema)]).optional(),
  serviceRequest: z.union([z.boolean(), z.lazy(() => ServiceRequestArgsObjectSchema)]).optional(),
  variant: z.union([z.boolean(), z.lazy(() => ProductVariantArgsObjectSchema)]).optional(),
  vendor: z.union([z.boolean(), z.lazy(() => VendorArgsObjectSchema)]).optional(),
  serviceDetail: z.union([z.boolean(), z.lazy(() => ServiceCatalogFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => MaintenanceRecordCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const MaintenanceRecordIncludeObjectSchema: z.ZodType<Prisma.MaintenanceRecordInclude> = makeSchema() as unknown as z.ZodType<Prisma.MaintenanceRecordInclude>;
export const MaintenanceRecordIncludeObjectZodSchema = makeSchema();
