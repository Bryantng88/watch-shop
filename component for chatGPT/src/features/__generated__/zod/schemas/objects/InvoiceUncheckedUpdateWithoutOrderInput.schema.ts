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
import { InvoiceItemUncheckedUpdateManyWithoutInvoiceNestedInputObjectSchema as InvoiceItemUncheckedUpdateManyWithoutInvoiceNestedInputObjectSchema } from './InvoiceItemUncheckedUpdateManyWithoutInvoiceNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  code: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  type: z.union([InvoiceTypeSchema, z.lazy(() => EnumInvoiceTypeFieldUpdateOperationsInputObjectSchema)]).optional(),
  status: z.union([InvoiceStatusSchema, z.lazy(() => EnumInvoiceStatusFieldUpdateOperationsInputObjectSchema)]).optional(),
  customerId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  vendorId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  acquisitionId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  serviceRequestId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
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
  items: z.lazy(() => InvoiceItemUncheckedUpdateManyWithoutInvoiceNestedInputObjectSchema).optional()
}).strict();
export const InvoiceUncheckedUpdateWithoutOrderInputObjectSchema: z.ZodType<Prisma.InvoiceUncheckedUpdateWithoutOrderInput> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceUncheckedUpdateWithoutOrderInput>;
export const InvoiceUncheckedUpdateWithoutOrderInputObjectZodSchema = makeSchema();
