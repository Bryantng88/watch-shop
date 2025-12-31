import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema as NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { InvoiceUncheckedUpdateManyWithoutCustomerNestedInputObjectSchema as InvoiceUncheckedUpdateManyWithoutCustomerNestedInputObjectSchema } from './InvoiceUncheckedUpdateManyWithoutCustomerNestedInput.schema';
import { OrderUncheckedUpdateManyWithoutCustomerNestedInputObjectSchema as OrderUncheckedUpdateManyWithoutCustomerNestedInputObjectSchema } from './OrderUncheckedUpdateManyWithoutCustomerNestedInput.schema';
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
  address: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  Invoice: z.lazy(() => InvoiceUncheckedUpdateManyWithoutCustomerNestedInputObjectSchema).optional(),
  orders: z.lazy(() => OrderUncheckedUpdateManyWithoutCustomerNestedInputObjectSchema).optional(),
  ServiceRequest: z.lazy(() => ServiceRequestUncheckedUpdateManyWithoutCustomerNestedInputObjectSchema).optional()
}).strict();
export const CustomerUncheckedUpdateWithoutAcquisitionInputObjectSchema: z.ZodType<Prisma.CustomerUncheckedUpdateWithoutAcquisitionInput> = makeSchema() as unknown as z.ZodType<Prisma.CustomerUncheckedUpdateWithoutAcquisitionInput>;
export const CustomerUncheckedUpdateWithoutAcquisitionInputObjectZodSchema = makeSchema();
