import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalIssueTypeSchema } from '../enums/TechnicalIssueType.schema';
import { TechnicalActionModeSchema } from '../enums/TechnicalActionMode.schema';
import { TechnicalIssueExecutionStatusSchema } from '../enums/TechnicalIssueExecutionStatus.schema';
import { MaintenanceRecordCreateNestedManyWithoutTechnicalIssueInputObjectSchema as MaintenanceRecordCreateNestedManyWithoutTechnicalIssueInputObjectSchema } from './MaintenanceRecordCreateNestedManyWithoutTechnicalIssueInput.schema';
import { TechnicalAssessmentCreateNestedOneWithoutTechnicalIssueInputObjectSchema as TechnicalAssessmentCreateNestedOneWithoutTechnicalIssueInputObjectSchema } from './TechnicalAssessmentCreateNestedOneWithoutTechnicalIssueInput.schema';
import { MechanicalPartCatalogCreateNestedOneWithoutTechnicalIssueInputObjectSchema as MechanicalPartCatalogCreateNestedOneWithoutTechnicalIssueInputObjectSchema } from './MechanicalPartCatalogCreateNestedOneWithoutTechnicalIssueInput.schema';
import { ServiceCatalogCreateNestedOneWithoutTechnicalIssueInputObjectSchema as ServiceCatalogCreateNestedOneWithoutTechnicalIssueInputObjectSchema } from './ServiceCatalogCreateNestedOneWithoutTechnicalIssueInput.schema';
import { ServiceRequestCreateNestedOneWithoutTechnicalIssueInputObjectSchema as ServiceRequestCreateNestedOneWithoutTechnicalIssueInputObjectSchema } from './ServiceRequestCreateNestedOneWithoutTechnicalIssueInput.schema';
import { UserCreateNestedOneWithoutTechnicalIssueInputObjectSchema as UserCreateNestedOneWithoutTechnicalIssueInputObjectSchema } from './UserCreateNestedOneWithoutTechnicalIssueInput.schema';
import { VendorCreateNestedOneWithoutTechnicalIssueInputObjectSchema as VendorCreateNestedOneWithoutTechnicalIssueInputObjectSchema } from './VendorCreateNestedOneWithoutTechnicalIssueInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  area: z.string().optional().nullable(),
  issueType: TechnicalIssueTypeSchema.optional(),
  actionMode: TechnicalActionModeSchema.optional(),
  note: z.string().optional().nullable(),
  estimatedCost: z.number().optional().nullable(),
  sortOrder: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  vendorNameSnap: z.string().optional().nullable(),
  executionStatus: TechnicalIssueExecutionStatusSchema.optional(),
  openedAt: z.coerce.date(),
  startedAt: z.coerce.date().optional().nullable(),
  completedAt: z.coerce.date().optional().nullable(),
  canceledAt: z.coerce.date().optional().nullable(),
  actualCost: z.number().optional().nullable(),
  summary: z.string().optional().nullable(),
  resolutionNote: z.string().optional().nullable(),
  completedByNameSnap: z.string().optional().nullable(),
  isConfirmed: z.boolean().optional(),
  confirmedAt: z.coerce.date().optional().nullable(),
  confirmedById: z.string().optional().nullable(),
  confirmedByNameSnap: z.string().optional().nullable(),
  MaintenanceRecord: z.lazy(() => MaintenanceRecordCreateNestedManyWithoutTechnicalIssueInputObjectSchema).optional(),
  TechnicalAssessment: z.lazy(() => TechnicalAssessmentCreateNestedOneWithoutTechnicalIssueInputObjectSchema),
  MechanicalPartCatalog: z.lazy(() => MechanicalPartCatalogCreateNestedOneWithoutTechnicalIssueInputObjectSchema).optional(),
  ServiceCatalog: z.lazy(() => ServiceCatalogCreateNestedOneWithoutTechnicalIssueInputObjectSchema).optional(),
  ServiceRequest: z.lazy(() => ServiceRequestCreateNestedOneWithoutTechnicalIssueInputObjectSchema),
  User: z.lazy(() => UserCreateNestedOneWithoutTechnicalIssueInputObjectSchema).optional(),
  Vendor: z.lazy(() => VendorCreateNestedOneWithoutTechnicalIssueInputObjectSchema).optional()
}).strict();
export const TechnicalIssueCreateWithoutSupplyCatalogInputObjectSchema: z.ZodType<Prisma.TechnicalIssueCreateWithoutSupplyCatalogInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalIssueCreateWithoutSupplyCatalogInput>;
export const TechnicalIssueCreateWithoutSupplyCatalogInputObjectZodSchema = makeSchema();
