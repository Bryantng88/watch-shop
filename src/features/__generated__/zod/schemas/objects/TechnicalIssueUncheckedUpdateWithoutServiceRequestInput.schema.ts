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
import { MaintenanceRecordUncheckedUpdateManyWithoutTechnicalIssueNestedInputObjectSchema as MaintenanceRecordUncheckedUpdateManyWithoutTechnicalIssueNestedInputObjectSchema } from './MaintenanceRecordUncheckedUpdateManyWithoutTechnicalIssueNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  assessmentId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  area: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  issueType: z.union([TechnicalIssueTypeSchema, z.lazy(() => EnumTechnicalIssueTypeFieldUpdateOperationsInputObjectSchema)]).optional(),
  actionMode: z.union([TechnicalActionModeSchema, z.lazy(() => EnumTechnicalActionModeFieldUpdateOperationsInputObjectSchema)]).optional(),
  serviceCatalogId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  supplyCatalogId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  note: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  estimatedCost: z.union([z.number(), z.lazy(() => NullableDecimalFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  sortOrder: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputObjectSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  vendorId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  vendorNameSnap: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  mechanicalPartCatalogId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  executionStatus: z.union([TechnicalIssueExecutionStatusSchema, z.lazy(() => EnumTechnicalIssueExecutionStatusFieldUpdateOperationsInputObjectSchema)]).optional(),
  openedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  startedAt: z.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  completedAt: z.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  canceledAt: z.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  actualCost: z.union([z.number(), z.lazy(() => NullableDecimalFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  technicianId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  summary: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  resolutionNote: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  completedByNameSnap: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  MaintenanceRecord: z.lazy(() => MaintenanceRecordUncheckedUpdateManyWithoutTechnicalIssueNestedInputObjectSchema).optional()
}).strict();
export const TechnicalIssueUncheckedUpdateWithoutServiceRequestInputObjectSchema: z.ZodType<Prisma.TechnicalIssueUncheckedUpdateWithoutServiceRequestInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalIssueUncheckedUpdateWithoutServiceRequestInput>;
export const TechnicalIssueUncheckedUpdateWithoutServiceRequestInputObjectZodSchema = makeSchema();
