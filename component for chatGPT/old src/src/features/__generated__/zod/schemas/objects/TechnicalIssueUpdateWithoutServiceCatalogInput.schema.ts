import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema as NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { TechnicalIssueTypeSchema } from '../enums/TechnicalIssueType.schema';
import { EnumTechnicalIssueTypeFieldUpdateOperationsInputObjectSchema as EnumTechnicalIssueTypeFieldUpdateOperationsInputObjectSchema } from './EnumTechnicalIssueTypeFieldUpdateOperationsInput.schema';
import { TechnicalActionModeSchema } from '../enums/TechnicalActionMode.schema';
import { EnumTechnicalActionModeFieldUpdateOperationsInputObjectSchema as EnumTechnicalActionModeFieldUpdateOperationsInputObjectSchema } from './EnumTechnicalActionModeFieldUpdateOperationsInput.schema';
import { NullableDecimalFieldUpdateOperationsInputObjectSchema as NullableDecimalFieldUpdateOperationsInputObjectSchema } from './NullableDecimalFieldUpdateOperationsInput.schema';
import { IntFieldUpdateOperationsInputObjectSchema as IntFieldUpdateOperationsInputObjectSchema } from './IntFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { TechnicalIssueExecutionStatusSchema } from '../enums/TechnicalIssueExecutionStatus.schema';
import { EnumTechnicalIssueExecutionStatusFieldUpdateOperationsInputObjectSchema as EnumTechnicalIssueExecutionStatusFieldUpdateOperationsInputObjectSchema } from './EnumTechnicalIssueExecutionStatusFieldUpdateOperationsInput.schema';
import { NullableDateTimeFieldUpdateOperationsInputObjectSchema as NullableDateTimeFieldUpdateOperationsInputObjectSchema } from './NullableDateTimeFieldUpdateOperationsInput.schema';
import { BoolFieldUpdateOperationsInputObjectSchema as BoolFieldUpdateOperationsInputObjectSchema } from './BoolFieldUpdateOperationsInput.schema';
import { MaintenanceRecordUpdateManyWithoutTechnicalIssueNestedInputObjectSchema as MaintenanceRecordUpdateManyWithoutTechnicalIssueNestedInputObjectSchema } from './MaintenanceRecordUpdateManyWithoutTechnicalIssueNestedInput.schema';
import { TechnicalAssessmentUpdateOneRequiredWithoutTechnicalIssueNestedInputObjectSchema as TechnicalAssessmentUpdateOneRequiredWithoutTechnicalIssueNestedInputObjectSchema } from './TechnicalAssessmentUpdateOneRequiredWithoutTechnicalIssueNestedInput.schema';
import { MechanicalPartCatalogUpdateOneWithoutTechnicalIssueNestedInputObjectSchema as MechanicalPartCatalogUpdateOneWithoutTechnicalIssueNestedInputObjectSchema } from './MechanicalPartCatalogUpdateOneWithoutTechnicalIssueNestedInput.schema';
import { ServiceRequestUpdateOneRequiredWithoutTechnicalIssueNestedInputObjectSchema as ServiceRequestUpdateOneRequiredWithoutTechnicalIssueNestedInputObjectSchema } from './ServiceRequestUpdateOneRequiredWithoutTechnicalIssueNestedInput.schema';
import { SupplyCatalogUpdateOneWithoutTechnicalIssueNestedInputObjectSchema as SupplyCatalogUpdateOneWithoutTechnicalIssueNestedInputObjectSchema } from './SupplyCatalogUpdateOneWithoutTechnicalIssueNestedInput.schema';
import { UserUpdateOneWithoutTechnicalIssueNestedInputObjectSchema as UserUpdateOneWithoutTechnicalIssueNestedInputObjectSchema } from './UserUpdateOneWithoutTechnicalIssueNestedInput.schema';
import { VendorUpdateOneWithoutTechnicalIssueNestedInputObjectSchema as VendorUpdateOneWithoutTechnicalIssueNestedInputObjectSchema } from './VendorUpdateOneWithoutTechnicalIssueNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  area: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  issueType: z.union([TechnicalIssueTypeSchema, z.lazy(() => EnumTechnicalIssueTypeFieldUpdateOperationsInputObjectSchema)]).optional(),
  actionMode: z.union([TechnicalActionModeSchema, z.lazy(() => EnumTechnicalActionModeFieldUpdateOperationsInputObjectSchema)]).optional(),
  note: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  estimatedCost: z.union([z.number(), z.lazy(() => NullableDecimalFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  sortOrder: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputObjectSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  vendorNameSnap: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  executionStatus: z.union([TechnicalIssueExecutionStatusSchema, z.lazy(() => EnumTechnicalIssueExecutionStatusFieldUpdateOperationsInputObjectSchema)]).optional(),
  openedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  startedAt: z.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  completedAt: z.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  canceledAt: z.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  actualCost: z.union([z.number(), z.lazy(() => NullableDecimalFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  summary: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  resolutionNote: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  completedByNameSnap: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  isConfirmed: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputObjectSchema)]).optional(),
  confirmedAt: z.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  confirmedById: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  confirmedByNameSnap: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  MaintenanceRecord: z.lazy(() => MaintenanceRecordUpdateManyWithoutTechnicalIssueNestedInputObjectSchema).optional(),
  TechnicalAssessment: z.lazy(() => TechnicalAssessmentUpdateOneRequiredWithoutTechnicalIssueNestedInputObjectSchema).optional(),
  MechanicalPartCatalog: z.lazy(() => MechanicalPartCatalogUpdateOneWithoutTechnicalIssueNestedInputObjectSchema).optional(),
  ServiceRequest: z.lazy(() => ServiceRequestUpdateOneRequiredWithoutTechnicalIssueNestedInputObjectSchema).optional(),
  SupplyCatalog: z.lazy(() => SupplyCatalogUpdateOneWithoutTechnicalIssueNestedInputObjectSchema).optional(),
  User: z.lazy(() => UserUpdateOneWithoutTechnicalIssueNestedInputObjectSchema).optional(),
  Vendor: z.lazy(() => VendorUpdateOneWithoutTechnicalIssueNestedInputObjectSchema).optional()
}).strict();
export const TechnicalIssueUpdateWithoutServiceCatalogInputObjectSchema: z.ZodType<Prisma.TechnicalIssueUpdateWithoutServiceCatalogInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalIssueUpdateWithoutServiceCatalogInput>;
export const TechnicalIssueUpdateWithoutServiceCatalogInputObjectZodSchema = makeSchema();
