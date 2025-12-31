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
import { OrderItemUncheckedUpdateManyWithoutServiceCatalogNestedInputObjectSchema as OrderItemUncheckedUpdateManyWithoutServiceCatalogNestedInputObjectSchema } from './OrderItemUncheckedUpdateManyWithoutServiceCatalogNestedInput.schema';
import { ServiceRequestUncheckedUpdateManyWithoutServiceCatalogNestedInputObjectSchema as ServiceRequestUncheckedUpdateManyWithoutServiceCatalogNestedInputObjectSchema } from './ServiceRequestUncheckedUpdateManyWithoutServiceCatalogNestedInput.schema'

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
  OrderItem: z.lazy(() => OrderItemUncheckedUpdateManyWithoutServiceCatalogNestedInputObjectSchema).optional(),
  ServiceRequest: z.lazy(() => ServiceRequestUncheckedUpdateManyWithoutServiceCatalogNestedInputObjectSchema).optional()
}).strict();
export const ServiceCatalogUncheckedUpdateInputObjectSchema: z.ZodType<Prisma.ServiceCatalogUncheckedUpdateInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceCatalogUncheckedUpdateInput>;
export const ServiceCatalogUncheckedUpdateInputObjectZodSchema = makeSchema();
