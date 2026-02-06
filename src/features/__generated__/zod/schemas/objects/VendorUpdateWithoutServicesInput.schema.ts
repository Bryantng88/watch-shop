import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { VendorRoleSchema } from '../enums/VendorRole.schema';
import { EnumVendorRoleFieldUpdateOperationsInputObjectSchema as EnumVendorRoleFieldUpdateOperationsInputObjectSchema } from './EnumVendorRoleFieldUpdateOperationsInput.schema';
import { BoolFieldUpdateOperationsInputObjectSchema as BoolFieldUpdateOperationsInputObjectSchema } from './BoolFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema as NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { AcquisitionUpdateManyWithoutVendorNestedInputObjectSchema as AcquisitionUpdateManyWithoutVendorNestedInputObjectSchema } from './AcquisitionUpdateManyWithoutVendorNestedInput.schema';
import { InvoiceUpdateManyWithoutVendorNestedInputObjectSchema as InvoiceUpdateManyWithoutVendorNestedInputObjectSchema } from './InvoiceUpdateManyWithoutVendorNestedInput.schema';
import { ProductUpdateManyWithoutVendorNestedInputObjectSchema as ProductUpdateManyWithoutVendorNestedInputObjectSchema } from './ProductUpdateManyWithoutVendorNestedInput.schema';
import { ServiceRequestUpdateManyWithoutVendorNestedInputObjectSchema as ServiceRequestUpdateManyWithoutVendorNestedInputObjectSchema } from './ServiceRequestUpdateManyWithoutVendorNestedInput.schema';
import { BankUpdateOneWithoutVendorNestedInputObjectSchema as BankUpdateOneWithoutVendorNestedInputObjectSchema } from './BankUpdateOneWithoutVendorNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  role: z.union([VendorRoleSchema, z.lazy(() => EnumVendorRoleFieldUpdateOperationsInputObjectSchema)]).optional(),
  isAuthorized: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputObjectSchema)]).optional(),
  email: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  phone: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  address: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  note: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  bankAcc: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  isActive: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputObjectSchema)]).optional(),
  acquisitions: z.lazy(() => AcquisitionUpdateManyWithoutVendorNestedInputObjectSchema).optional(),
  invoice: z.lazy(() => InvoiceUpdateManyWithoutVendorNestedInputObjectSchema).optional(),
  Product: z.lazy(() => ProductUpdateManyWithoutVendorNestedInputObjectSchema).optional(),
  ServiceRequest: z.lazy(() => ServiceRequestUpdateManyWithoutVendorNestedInputObjectSchema).optional(),
  Bank: z.lazy(() => BankUpdateOneWithoutVendorNestedInputObjectSchema).optional()
}).strict();
export const VendorUpdateWithoutServicesInputObjectSchema: z.ZodType<Prisma.VendorUpdateWithoutServicesInput> = makeSchema() as unknown as z.ZodType<Prisma.VendorUpdateWithoutServicesInput>;
export const VendorUpdateWithoutServicesInputObjectZodSchema = makeSchema();
