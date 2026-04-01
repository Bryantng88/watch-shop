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
import { TechnicalAssessmentUpdateOneRequiredWithoutTechnicalIssueNestedInputObjectSchema as TechnicalAssessmentUpdateOneRequiredWithoutTechnicalIssueNestedInputObjectSchema } from './TechnicalAssessmentUpdateOneRequiredWithoutTechnicalIssueNestedInput.schema';
import { MechanicalPartCatalogUpdateOneWithoutTechnicalIssueNestedInputObjectSchema as MechanicalPartCatalogUpdateOneWithoutTechnicalIssueNestedInputObjectSchema } from './MechanicalPartCatalogUpdateOneWithoutTechnicalIssueNestedInput.schema';
import { ServiceCatalogUpdateOneWithoutTechnicalIssueNestedInputObjectSchema as ServiceCatalogUpdateOneWithoutTechnicalIssueNestedInputObjectSchema } from './ServiceCatalogUpdateOneWithoutTechnicalIssueNestedInput.schema';
import { SupplyCatalogUpdateOneWithoutTechnicalIssueNestedInputObjectSchema as SupplyCatalogUpdateOneWithoutTechnicalIssueNestedInputObjectSchema } from './SupplyCatalogUpdateOneWithoutTechnicalIssueNestedInput.schema';
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
  TechnicalAssessment: z.lazy(() => TechnicalAssessmentUpdateOneRequiredWithoutTechnicalIssueNestedInputObjectSchema).optional(),
  MechanicalPartCatalog: z.lazy(() => MechanicalPartCatalogUpdateOneWithoutTechnicalIssueNestedInputObjectSchema).optional(),
  ServiceCatalog: z.lazy(() => ServiceCatalogUpdateOneWithoutTechnicalIssueNestedInputObjectSchema).optional(),
  SupplyCatalog: z.lazy(() => SupplyCatalogUpdateOneWithoutTechnicalIssueNestedInputObjectSchema).optional(),
  Vendor: z.lazy(() => VendorUpdateOneWithoutTechnicalIssueNestedInputObjectSchema).optional()
}).strict();
export const TechnicalIssueUpdateInputObjectSchema: z.ZodType<Prisma.TechnicalIssueUpdateInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalIssueUpdateInput>;
export const TechnicalIssueUpdateInputObjectZodSchema = makeSchema();
