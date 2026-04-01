import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema as NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { NullableDecimalFieldUpdateOperationsInputObjectSchema as NullableDecimalFieldUpdateOperationsInputObjectSchema } from './NullableDecimalFieldUpdateOperationsInput.schema';
import { NullableIntFieldUpdateOperationsInputObjectSchema as NullableIntFieldUpdateOperationsInputObjectSchema } from './NullableIntFieldUpdateOperationsInput.schema';
import { BoolFieldUpdateOperationsInputObjectSchema as BoolFieldUpdateOperationsInputObjectSchema } from './BoolFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { ServiceDetailSchema } from '../enums/ServiceDetail.schema';
import { EnumServiceDetailFieldUpdateOperationsInputObjectSchema as EnumServiceDetailFieldUpdateOperationsInputObjectSchema } from './EnumServiceDetailFieldUpdateOperationsInput.schema';
import { IntFieldUpdateOperationsInputObjectSchema as IntFieldUpdateOperationsInputObjectSchema } from './IntFieldUpdateOperationsInput.schema';
import { ServiceRequestUncheckedUpdateManyWithoutServiceCatalogNestedInputObjectSchema as ServiceRequestUncheckedUpdateManyWithoutServiceCatalogNestedInputObjectSchema } from './ServiceRequestUncheckedUpdateManyWithoutServiceCatalogNestedInput.schema';
import { TechnicalIssueUncheckedUpdateManyWithoutServiceCatalogNestedInputObjectSchema as TechnicalIssueUncheckedUpdateManyWithoutServiceCatalogNestedInputObjectSchema } from './TechnicalIssueUncheckedUpdateManyWithoutServiceCatalogNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  code: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  description: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  defaultPrice: z.union([z.number(), z.lazy(() => NullableDecimalFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  durationMin: z.union([z.number().int(), z.lazy(() => NullableIntFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  isActive: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputObjectSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  maintenanceRecordId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  detail: z.union([ServiceDetailSchema, z.lazy(() => EnumServiceDetailFieldUpdateOperationsInputObjectSchema)]).optional(),
  vendorPrice: z.union([z.number(), z.lazy(() => NullableDecimalFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  customerPrice: z.union([z.number(), z.lazy(() => NullableDecimalFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  internalCost: z.union([z.number(), z.lazy(() => NullableDecimalFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  note: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  categoryKey: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  sortOrder: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputObjectSchema)]).optional(),
  ServiceRequest: z.lazy(() => ServiceRequestUncheckedUpdateManyWithoutServiceCatalogNestedInputObjectSchema).optional(),
  TechnicalIssue: z.lazy(() => TechnicalIssueUncheckedUpdateManyWithoutServiceCatalogNestedInputObjectSchema).optional()
}).strict();
export const ServiceCatalogUncheckedUpdateWithoutOrderItemInputObjectSchema: z.ZodType<Prisma.ServiceCatalogUncheckedUpdateWithoutOrderItemInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceCatalogUncheckedUpdateWithoutOrderItemInput>;
export const ServiceCatalogUncheckedUpdateWithoutOrderItemInputObjectZodSchema = makeSchema();
