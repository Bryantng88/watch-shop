import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { AcquisitionTypeSchema } from '../enums/AcquisitionType.schema';
import { EnumAcquisitionTypeFieldUpdateOperationsInputObjectSchema as EnumAcquisitionTypeFieldUpdateOperationsInputObjectSchema } from './EnumAcquisitionTypeFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { NullableDecimalFieldUpdateOperationsInputObjectSchema as NullableDecimalFieldUpdateOperationsInputObjectSchema } from './NullableDecimalFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema as NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { NullableDateTimeFieldUpdateOperationsInputObjectSchema as NullableDateTimeFieldUpdateOperationsInputObjectSchema } from './NullableDateTimeFieldUpdateOperationsInput.schema';
import { CustomerUpdateOneWithoutAcquisitionNestedInputObjectSchema as CustomerUpdateOneWithoutAcquisitionNestedInputObjectSchema } from './CustomerUpdateOneWithoutAcquisitionNestedInput.schema';
import { VendorUpdateOneWithoutAcquisitionsNestedInputObjectSchema as VendorUpdateOneWithoutAcquisitionsNestedInputObjectSchema } from './VendorUpdateOneWithoutAcquisitionsNestedInput.schema';
import { InvoiceUpdateManyWithoutAcquisitionNestedInputObjectSchema as InvoiceUpdateManyWithoutAcquisitionNestedInputObjectSchema } from './InvoiceUpdateManyWithoutAcquisitionNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  type: z.union([AcquisitionTypeSchema, z.lazy(() => EnumAcquisitionTypeFieldUpdateOperationsInputObjectSchema)]).optional(),
  acquiredAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  cost: z.union([z.number(), z.lazy(() => NullableDecimalFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  currency: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  payoutStatus: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  refNo: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  notes: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  condition: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  warrantyUntil: z.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  customer: z.lazy(() => CustomerUpdateOneWithoutAcquisitionNestedInputObjectSchema).optional(),
  vendor: z.lazy(() => VendorUpdateOneWithoutAcquisitionsNestedInputObjectSchema).optional(),
  Invoice: z.lazy(() => InvoiceUpdateManyWithoutAcquisitionNestedInputObjectSchema).optional()
}).strict();
export const AcquisitionUpdateWithoutAcquisitionItemInputObjectSchema: z.ZodType<Prisma.AcquisitionUpdateWithoutAcquisitionItemInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionUpdateWithoutAcquisitionItemInput>;
export const AcquisitionUpdateWithoutAcquisitionItemInputObjectZodSchema = makeSchema();
