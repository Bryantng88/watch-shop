import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema as NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { AcquisitionTypeSchema } from '../enums/AcquisitionType.schema';
import { EnumAcquisitionTypeFieldUpdateOperationsInputObjectSchema as EnumAcquisitionTypeFieldUpdateOperationsInputObjectSchema } from './EnumAcquisitionTypeFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { NullableDecimalFieldUpdateOperationsInputObjectSchema as NullableDecimalFieldUpdateOperationsInputObjectSchema } from './NullableDecimalFieldUpdateOperationsInput.schema';
import { AcquisitionStatusSchema } from '../enums/AcquisitionStatus.schema';
import { EnumAcquisitionStatusFieldUpdateOperationsInputObjectSchema as EnumAcquisitionStatusFieldUpdateOperationsInputObjectSchema } from './EnumAcquisitionStatusFieldUpdateOperationsInput.schema';
import { NullableDateTimeFieldUpdateOperationsInputObjectSchema as NullableDateTimeFieldUpdateOperationsInputObjectSchema } from './NullableDateTimeFieldUpdateOperationsInput.schema';
import { AcquisitionItemUncheckedUpdateManyWithoutAcquisitionNestedInputObjectSchema as AcquisitionItemUncheckedUpdateManyWithoutAcquisitionNestedInputObjectSchema } from './AcquisitionItemUncheckedUpdateManyWithoutAcquisitionNestedInput.schema';
import { InvoiceUncheckedUpdateManyWithoutAcquisitionNestedInputObjectSchema as InvoiceUncheckedUpdateManyWithoutAcquisitionNestedInputObjectSchema } from './InvoiceUncheckedUpdateManyWithoutAcquisitionNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  vendorId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  customerId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  type: z.union([AcquisitionTypeSchema, z.lazy(() => EnumAcquisitionTypeFieldUpdateOperationsInputObjectSchema)]).optional(),
  acquiredAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  cost: z.union([z.number(), z.lazy(() => NullableDecimalFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  currency: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  payoutStatus: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  accquisitionStt: z.union([AcquisitionStatusSchema, z.lazy(() => EnumAcquisitionStatusFieldUpdateOperationsInputObjectSchema)]).optional(),
  refNo: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  notes: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  condition: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  warrantyUntil: z.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  AcquisitionItem: z.lazy(() => AcquisitionItemUncheckedUpdateManyWithoutAcquisitionNestedInputObjectSchema).optional(),
  Invoice: z.lazy(() => InvoiceUncheckedUpdateManyWithoutAcquisitionNestedInputObjectSchema).optional()
}).strict();
export const AcquisitionUncheckedUpdateInputObjectSchema: z.ZodType<Prisma.AcquisitionUncheckedUpdateInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionUncheckedUpdateInput>;
export const AcquisitionUncheckedUpdateInputObjectZodSchema = makeSchema();
