import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { VendorRoleSchema } from '../enums/VendorRole.schema';
import { EnumVendorRoleFieldUpdateOperationsInputObjectSchema as EnumVendorRoleFieldUpdateOperationsInputObjectSchema } from './EnumVendorRoleFieldUpdateOperationsInput.schema';
import { BoolFieldUpdateOperationsInputObjectSchema as BoolFieldUpdateOperationsInputObjectSchema } from './BoolFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema as NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { AcquisitionUncheckedUpdateManyWithoutVendorNestedInputObjectSchema as AcquisitionUncheckedUpdateManyWithoutVendorNestedInputObjectSchema } from './AcquisitionUncheckedUpdateManyWithoutVendorNestedInput.schema';
import { MaintenanceRecordUncheckedUpdateManyWithoutVendorNestedInputObjectSchema as MaintenanceRecordUncheckedUpdateManyWithoutVendorNestedInputObjectSchema } from './MaintenanceRecordUncheckedUpdateManyWithoutVendorNestedInput.schema';
import { ProductUncheckedUpdateManyWithoutVendorNestedInputObjectSchema as ProductUncheckedUpdateManyWithoutVendorNestedInputObjectSchema } from './ProductUncheckedUpdateManyWithoutVendorNestedInput.schema'

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
  acquisitions: z.lazy(() => AcquisitionUncheckedUpdateManyWithoutVendorNestedInputObjectSchema).optional(),
  services: z.lazy(() => MaintenanceRecordUncheckedUpdateManyWithoutVendorNestedInputObjectSchema).optional(),
  Product: z.lazy(() => ProductUncheckedUpdateManyWithoutVendorNestedInputObjectSchema).optional()
}).strict();
export const VendorUncheckedUpdateWithoutInvoiceInputObjectSchema: z.ZodType<Prisma.VendorUncheckedUpdateWithoutInvoiceInput> = makeSchema() as unknown as z.ZodType<Prisma.VendorUncheckedUpdateWithoutInvoiceInput>;
export const VendorUncheckedUpdateWithoutInvoiceInputObjectZodSchema = makeSchema();
