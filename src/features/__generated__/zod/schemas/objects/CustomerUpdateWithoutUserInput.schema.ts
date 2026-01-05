import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema as NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { AcquisitionUpdateManyWithoutCustomerNestedInputObjectSchema as AcquisitionUpdateManyWithoutCustomerNestedInputObjectSchema } from './AcquisitionUpdateManyWithoutCustomerNestedInput.schema';
import { InvoiceUpdateManyWithoutCustomerNestedInputObjectSchema as InvoiceUpdateManyWithoutCustomerNestedInputObjectSchema } from './InvoiceUpdateManyWithoutCustomerNestedInput.schema';
import { OrderUpdateManyWithoutCustomerNestedInputObjectSchema as OrderUpdateManyWithoutCustomerNestedInputObjectSchema } from './OrderUpdateManyWithoutCustomerNestedInput.schema';
import { ServiceRequestUpdateManyWithoutCustomerNestedInputObjectSchema as ServiceRequestUpdateManyWithoutCustomerNestedInputObjectSchema } from './ServiceRequestUpdateManyWithoutCustomerNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  email: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  phone: z.union([z.string().max(32), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  ward: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  city: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  address: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  district: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  Acquisition: z.lazy(() => AcquisitionUpdateManyWithoutCustomerNestedInputObjectSchema).optional(),
  Invoice: z.lazy(() => InvoiceUpdateManyWithoutCustomerNestedInputObjectSchema).optional(),
  orders: z.lazy(() => OrderUpdateManyWithoutCustomerNestedInputObjectSchema).optional(),
  ServiceRequest: z.lazy(() => ServiceRequestUpdateManyWithoutCustomerNestedInputObjectSchema).optional()
}).strict();
export const CustomerUpdateWithoutUserInputObjectSchema: z.ZodType<Prisma.CustomerUpdateWithoutUserInput> = makeSchema() as unknown as z.ZodType<Prisma.CustomerUpdateWithoutUserInput>;
export const CustomerUpdateWithoutUserInputObjectZodSchema = makeSchema();
