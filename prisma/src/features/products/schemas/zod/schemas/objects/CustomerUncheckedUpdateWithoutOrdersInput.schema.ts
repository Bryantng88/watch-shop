import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema as NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { AcquisitionUncheckedUpdateManyWithoutCustomerNestedInputObjectSchema as AcquisitionUncheckedUpdateManyWithoutCustomerNestedInputObjectSchema } from './AcquisitionUncheckedUpdateManyWithoutCustomerNestedInput.schema';
import { InvoiceUncheckedUpdateManyWithoutCustomerNestedInputObjectSchema as InvoiceUncheckedUpdateManyWithoutCustomerNestedInputObjectSchema } from './InvoiceUncheckedUpdateManyWithoutCustomerNestedInput.schema';
import { ServiceRequestUncheckedUpdateManyWithoutCustomerNestedInputObjectSchema as ServiceRequestUncheckedUpdateManyWithoutCustomerNestedInputObjectSchema } from './ServiceRequestUncheckedUpdateManyWithoutCustomerNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  email: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  phone: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  ward: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  city: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  userId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  Acquisition: z.lazy(() => AcquisitionUncheckedUpdateManyWithoutCustomerNestedInputObjectSchema).optional(),
  Invoice: z.lazy(() => InvoiceUncheckedUpdateManyWithoutCustomerNestedInputObjectSchema).optional(),
  ServiceRequest: z.lazy(() => ServiceRequestUncheckedUpdateManyWithoutCustomerNestedInputObjectSchema).optional()
}).strict();
export const CustomerUncheckedUpdateWithoutOrdersInputObjectSchema: z.ZodType<Prisma.CustomerUncheckedUpdateWithoutOrdersInput> = makeSchema() as unknown as z.ZodType<Prisma.CustomerUncheckedUpdateWithoutOrdersInput>;
export const CustomerUncheckedUpdateWithoutOrdersInputObjectZodSchema = makeSchema();
