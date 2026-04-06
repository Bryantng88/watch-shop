import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { MaintenanceRecordOrderByRelationAggregateInputObjectSchema as MaintenanceRecordOrderByRelationAggregateInputObjectSchema } from './MaintenanceRecordOrderByRelationAggregateInput.schema';
import { TechnicalAssessmentOrderByWithRelationInputObjectSchema as TechnicalAssessmentOrderByWithRelationInputObjectSchema } from './TechnicalAssessmentOrderByWithRelationInput.schema';
import { MechanicalPartCatalogOrderByWithRelationInputObjectSchema as MechanicalPartCatalogOrderByWithRelationInputObjectSchema } from './MechanicalPartCatalogOrderByWithRelationInput.schema';
import { ServiceCatalogOrderByWithRelationInputObjectSchema as ServiceCatalogOrderByWithRelationInputObjectSchema } from './ServiceCatalogOrderByWithRelationInput.schema';
import { ServiceRequestOrderByWithRelationInputObjectSchema as ServiceRequestOrderByWithRelationInputObjectSchema } from './ServiceRequestOrderByWithRelationInput.schema';
import { SupplyCatalogOrderByWithRelationInputObjectSchema as SupplyCatalogOrderByWithRelationInputObjectSchema } from './SupplyCatalogOrderByWithRelationInput.schema';
import { UserOrderByWithRelationInputObjectSchema as UserOrderByWithRelationInputObjectSchema } from './UserOrderByWithRelationInput.schema';
import { VendorOrderByWithRelationInputObjectSchema as VendorOrderByWithRelationInputObjectSchema } from './VendorOrderByWithRelationInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  assessmentId: SortOrderSchema.optional(),
  area: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  issueType: SortOrderSchema.optional(),
  actionMode: SortOrderSchema.optional(),
  serviceCatalogId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  supplyCatalogId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  note: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  estimatedCost: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  sortOrder: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  vendorId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  vendorNameSnap: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  mechanicalPartCatalogId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  serviceRequestId: SortOrderSchema.optional(),
  executionStatus: SortOrderSchema.optional(),
  openedAt: SortOrderSchema.optional(),
  startedAt: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  completedAt: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  canceledAt: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  actualCost: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  technicianId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  summary: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  resolutionNote: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  completedByNameSnap: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  isConfirmed: SortOrderSchema.optional(),
  confirmedAt: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  confirmedById: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  confirmedByNameSnap: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  MaintenanceRecord: z.lazy(() => MaintenanceRecordOrderByRelationAggregateInputObjectSchema).optional(),
  TechnicalAssessment: z.lazy(() => TechnicalAssessmentOrderByWithRelationInputObjectSchema).optional(),
  MechanicalPartCatalog: z.lazy(() => MechanicalPartCatalogOrderByWithRelationInputObjectSchema).optional(),
  ServiceCatalog: z.lazy(() => ServiceCatalogOrderByWithRelationInputObjectSchema).optional(),
  ServiceRequest: z.lazy(() => ServiceRequestOrderByWithRelationInputObjectSchema).optional(),
  SupplyCatalog: z.lazy(() => SupplyCatalogOrderByWithRelationInputObjectSchema).optional(),
  User: z.lazy(() => UserOrderByWithRelationInputObjectSchema).optional(),
  Vendor: z.lazy(() => VendorOrderByWithRelationInputObjectSchema).optional()
}).strict();
export const TechnicalIssueOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.TechnicalIssueOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalIssueOrderByWithRelationInput>;
export const TechnicalIssueOrderByWithRelationInputObjectZodSchema = makeSchema();
