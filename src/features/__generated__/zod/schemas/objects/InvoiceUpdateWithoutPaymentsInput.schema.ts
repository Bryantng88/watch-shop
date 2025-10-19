import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema as NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { InvoiceTypeSchema } from '../enums/InvoiceType.schema';
import { EnumInvoiceTypeFieldUpdateOperationsInputObjectSchema as EnumInvoiceTypeFieldUpdateOperationsInputObjectSchema } from './EnumInvoiceTypeFieldUpdateOperationsInput.schema';
import { InvoiceStatusSchema } from '../enums/InvoiceStatus.schema';
import { EnumInvoiceStatusFieldUpdateOperationsInputObjectSchema as EnumInvoiceStatusFieldUpdateOperationsInputObjectSchema } from './EnumInvoiceStatusFieldUpdateOperationsInput.schema';
import { DecimalFieldUpdateOperationsInputObjectSchema as DecimalFieldUpdateOperationsInputObjectSchema } from './DecimalFieldUpdateOperationsInput.schema';
import { NullableDateTimeFieldUpdateOperationsInputObjectSchema as NullableDateTimeFieldUpdateOperationsInputObjectSchema } from './NullableDateTimeFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { AcquisitionUpdateOneWithoutInvoiceNestedInputObjectSchema as AcquisitionUpdateOneWithoutInvoiceNestedInputObjectSchema } from './AcquisitionUpdateOneWithoutInvoiceNestedInput.schema';
import { CustomerUpdateOneWithoutInvoiceNestedInputObjectSchema as CustomerUpdateOneWithoutInvoiceNestedInputObjectSchema } from './CustomerUpdateOneWithoutInvoiceNestedInput.schema';
import { OrderUpdateOneWithoutInvoiceNestedInputObjectSchema as OrderUpdateOneWithoutInvoiceNestedInputObjectSchema } from './OrderUpdateOneWithoutInvoiceNestedInput.schema';
import { ServiceRequestUpdateOneWithoutInvoiceNestedInputObjectSchema as ServiceRequestUpdateOneWithoutInvoiceNestedInputObjectSchema } from './ServiceRequestUpdateOneWithoutInvoiceNestedInput.schema';
import { VendorUpdateOneWithoutInvoiceNestedInputObjectSchema as VendorUpdateOneWithoutInvoiceNestedInputObjectSchema } from './VendorUpdateOneWithoutInvoiceNestedInput.schema';
import { InvoiceItemUpdateManyWithoutInvoiceNestedInputObjectSchema as InvoiceItemUpdateManyWithoutInvoiceNestedInputObjectSchema } from './InvoiceItemUpdateManyWithoutInvoiceNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  code: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  type: z.union([InvoiceTypeSchema, z.lazy(() => EnumInvoiceTypeFieldUpdateOperationsInputObjectSchema)]).optional(),
  status: z.union([InvoiceStatusSchema, z.lazy(() => EnumInvoiceStatusFieldUpdateOperationsInputObjectSchema)]).optional(),
  currency: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  subTotal: z.union([z.number(), z.lazy(() => DecimalFieldUpdateOperationsInputObjectSchema)]).optional(),
  taxTotal: z.union([z.number(), z.lazy(() => DecimalFieldUpdateOperationsInputObjectSchema)]).optional(),
  discountTotal: z.union([z.number(), z.lazy(() => DecimalFieldUpdateOperationsInputObjectSchema)]).optional(),
  grandTotal: z.union([z.number(), z.lazy(() => DecimalFieldUpdateOperationsInputObjectSchema)]).optional(),
  issuedAt: z.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  dueAt: z.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  notes: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  acquisition: z.lazy(() => AcquisitionUpdateOneWithoutInvoiceNestedInputObjectSchema).optional(),
  customer: z.lazy(() => CustomerUpdateOneWithoutInvoiceNestedInputObjectSchema).optional(),
  order: z.lazy(() => OrderUpdateOneWithoutInvoiceNestedInputObjectSchema).optional(),
  serviceReq: z.lazy(() => ServiceRequestUpdateOneWithoutInvoiceNestedInputObjectSchema).optional(),
  vendor: z.lazy(() => VendorUpdateOneWithoutInvoiceNestedInputObjectSchema).optional(),
  items: z.lazy(() => InvoiceItemUpdateManyWithoutInvoiceNestedInputObjectSchema).optional()
}).strict();
export const InvoiceUpdateWithoutPaymentsInputObjectSchema: z.ZodType<Prisma.InvoiceUpdateWithoutPaymentsInput> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceUpdateWithoutPaymentsInput>;
export const InvoiceUpdateWithoutPaymentsInputObjectZodSchema = makeSchema();
