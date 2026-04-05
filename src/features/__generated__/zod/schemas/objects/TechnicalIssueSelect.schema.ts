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
import { TechnicalIssueCountOutputTypeArgsObjectSchema as TechnicalIssueCountOutputTypeArgsObjectSchema } from './TechnicalIssueCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  assessmentId: z.boolean().optional(),
  area: z.boolean().optional(),
  issueType: z.boolean().optional(),
  actionMode: z.boolean().optional(),
  serviceCatalogId: z.boolean().optional(),
  supplyCatalogId: z.boolean().optional(),
  note: z.boolean().optional(),
  estimatedCost: z.boolean().optional(),
  sortOrder: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  vendorId: z.boolean().optional(),
  vendorNameSnap: z.boolean().optional(),
  mechanicalPartCatalogId: z.boolean().optional(),
  serviceRequestId: z.boolean().optional(),
  executionStatus: z.boolean().optional(),
  openedAt: z.boolean().optional(),
  startedAt: z.boolean().optional(),
  completedAt: z.boolean().optional(),
  canceledAt: z.boolean().optional(),
  actualCost: z.boolean().optional(),
  technicianId: z.boolean().optional(),
  summary: z.boolean().optional(),
  resolutionNote: z.boolean().optional(),
  completedByNameSnap: z.boolean().optional(),
  MaintenanceRecord: z.union([z.boolean(), z.lazy(() => MaintenanceRecordFindManySchema)]).optional(),
  TechnicalAssessment: z.union([z.boolean(), z.lazy(() => TechnicalAssessmentArgsObjectSchema)]).optional(),
  MechanicalPartCatalog: z.union([z.boolean(), z.lazy(() => MechanicalPartCatalogArgsObjectSchema)]).optional(),
  ServiceCatalog: z.union([z.boolean(), z.lazy(() => ServiceCatalogArgsObjectSchema)]).optional(),
  ServiceRequest: z.union([z.boolean(), z.lazy(() => ServiceRequestArgsObjectSchema)]).optional(),
  SupplyCatalog: z.union([z.boolean(), z.lazy(() => SupplyCatalogArgsObjectSchema)]).optional(),
  User: z.union([z.boolean(), z.lazy(() => UserArgsObjectSchema)]).optional(),
  Vendor: z.union([z.boolean(), z.lazy(() => VendorArgsObjectSchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => TechnicalIssueCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const TechnicalIssueSelectObjectSchema: z.ZodType<Prisma.TechnicalIssueSelect> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalIssueSelect>;
export const TechnicalIssueSelectObjectZodSchema = makeSchema();
