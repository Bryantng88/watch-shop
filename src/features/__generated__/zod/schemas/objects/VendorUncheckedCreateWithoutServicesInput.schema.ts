import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { VendorRoleSchema } from '../enums/VendorRole.schema';
import { AcquisitionUncheckedCreateNestedManyWithoutVendorInputObjectSchema as AcquisitionUncheckedCreateNestedManyWithoutVendorInputObjectSchema } from './AcquisitionUncheckedCreateNestedManyWithoutVendorInput.schema';
import { InvoiceUncheckedCreateNestedManyWithoutVendorInputObjectSchema as InvoiceUncheckedCreateNestedManyWithoutVendorInputObjectSchema } from './InvoiceUncheckedCreateNestedManyWithoutVendorInput.schema';
import { ProductUncheckedCreateNestedManyWithoutVendorInputObjectSchema as ProductUncheckedCreateNestedManyWithoutVendorInputObjectSchema } from './ProductUncheckedCreateNestedManyWithoutVendorInput.schema';
import { ServiceRequestUncheckedCreateNestedManyWithoutVendorInputObjectSchema as ServiceRequestUncheckedCreateNestedManyWithoutVendorInputObjectSchema } from './ServiceRequestUncheckedCreateNestedManyWithoutVendorInput.schema';
import { TechnicalAssessmentUncheckedCreateNestedManyWithoutVendorInputObjectSchema as TechnicalAssessmentUncheckedCreateNestedManyWithoutVendorInputObjectSchema } from './TechnicalAssessmentUncheckedCreateNestedManyWithoutVendorInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string(),
  role: VendorRoleSchema.optional(),
  isAuthorized: z.boolean().optional(),
  email: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  note: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  bankName: z.string().optional().nullable(),
  bankAcc: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
  acquisitions: z.lazy(() => AcquisitionUncheckedCreateNestedManyWithoutVendorInputObjectSchema).optional(),
  invoice: z.lazy(() => InvoiceUncheckedCreateNestedManyWithoutVendorInputObjectSchema).optional(),
  Product: z.lazy(() => ProductUncheckedCreateNestedManyWithoutVendorInputObjectSchema).optional(),
  ServiceRequest: z.lazy(() => ServiceRequestUncheckedCreateNestedManyWithoutVendorInputObjectSchema).optional(),
  TechnicalAssessment: z.lazy(() => TechnicalAssessmentUncheckedCreateNestedManyWithoutVendorInputObjectSchema).optional()
}).strict();
export const VendorUncheckedCreateWithoutServicesInputObjectSchema: z.ZodType<Prisma.VendorUncheckedCreateWithoutServicesInput> = makeSchema() as unknown as z.ZodType<Prisma.VendorUncheckedCreateWithoutServicesInput>;
export const VendorUncheckedCreateWithoutServicesInputObjectZodSchema = makeSchema();
