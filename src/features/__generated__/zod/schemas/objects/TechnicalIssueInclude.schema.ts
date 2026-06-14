import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenanceRecordFindManySchema as MaintenanceRecordFindManySchema } from '../findManyMaintenanceRecord.schema';
import { TechnicalAssessmentArgsObjectSchema as TechnicalAssessmentArgsObjectSchema } from './TechnicalAssessmentArgs.schema';
import { MechanicalPartCatalogArgsObjectSchema as MechanicalPartCatalogArgsObjectSchema } from './MechanicalPartCatalogArgs.schema';
import { ServiceCatalogArgsObjectSchema as ServiceCatalogArgsObjectSchema } from './ServiceCatalogArgs.schema';
import { ServiceRequestArgsObjectSchema as ServiceRequestArgsObjectSchema } from './ServiceRequestArgs.schema';
import { SupplyCatalogArgsObjectSchema as SupplyCatalogArgsObjectSchema } from './SupplyCatalogArgs.schema';
import { UserArgsObjectSchema as UserArgsObjectSchema } from './UserArgs.schema';
import { VendorArgsObjectSchema as VendorArgsObjectSchema } from './VendorArgs.schema';
import { TechnicalDetailCatalogArgsObjectSchema as TechnicalDetailCatalogArgsObjectSchema } from './TechnicalDetailCatalogArgs.schema';
import { TaskFindManySchema as TaskFindManySchema } from '../findManyTask.schema';
import { PaymentFindManySchema as PaymentFindManySchema } from '../findManyPayment.schema';
import { TechnicalIssueCountOutputTypeArgsObjectSchema as TechnicalIssueCountOutputTypeArgsObjectSchema } from './TechnicalIssueCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  maintenanceRecord: z.union([z.boolean(), z.lazy(() => MaintenanceRecordFindManySchema)]).optional(),
  technicalAssessment: z.union([z.boolean(), z.lazy(() => TechnicalAssessmentArgsObjectSchema)]).optional(),
  MechanicalPartCatalog: z.union([z.boolean(), z.lazy(() => MechanicalPartCatalogArgsObjectSchema)]).optional(),
  serviceCatalog: z.union([z.boolean(), z.lazy(() => ServiceCatalogArgsObjectSchema)]).optional(),
  serviceRequest: z.union([z.boolean(), z.lazy(() => ServiceRequestArgsObjectSchema)]).optional(),
  SupplyCatalog: z.union([z.boolean(), z.lazy(() => SupplyCatalogArgsObjectSchema)]).optional(),
  user: z.union([z.boolean(), z.lazy(() => UserArgsObjectSchema)]).optional(),
  vendor: z.union([z.boolean(), z.lazy(() => VendorArgsObjectSchema)]).optional(),
  technicalDetailCatalog: z.union([z.boolean(), z.lazy(() => TechnicalDetailCatalogArgsObjectSchema)]).optional(),
  task: z.union([z.boolean(), z.lazy(() => TaskFindManySchema)]).optional(),
  payments: z.union([z.boolean(), z.lazy(() => PaymentFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => TechnicalIssueCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const TechnicalIssueIncludeObjectSchema: z.ZodType<Prisma.TechnicalIssueInclude> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalIssueInclude>;
export const TechnicalIssueIncludeObjectZodSchema = makeSchema();
