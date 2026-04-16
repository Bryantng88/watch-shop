import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { VendorRoleSchema } from '../enums/VendorRole.schema';
import { InvoiceUncheckedCreateNestedManyWithoutVendorInputObjectSchema as InvoiceUncheckedCreateNestedManyWithoutVendorInputObjectSchema } from './InvoiceUncheckedCreateNestedManyWithoutVendorInput.schema';
import { MaintenanceRecordUncheckedCreateNestedManyWithoutVendorInputObjectSchema as MaintenanceRecordUncheckedCreateNestedManyWithoutVendorInputObjectSchema } from './MaintenanceRecordUncheckedCreateNestedManyWithoutVendorInput.schema';
import { ProductUncheckedCreateNestedManyWithoutVendorInputObjectSchema as ProductUncheckedCreateNestedManyWithoutVendorInputObjectSchema } from './ProductUncheckedCreateNestedManyWithoutVendorInput.schema';
import { ServiceRequestUncheckedCreateNestedManyWithoutVendorInputObjectSchema as ServiceRequestUncheckedCreateNestedManyWithoutVendorInputObjectSchema } from './ServiceRequestUncheckedCreateNestedManyWithoutVendorInput.schema';
import { TechnicalAssessmentUncheckedCreateNestedManyWithoutVendorInputObjectSchema as TechnicalAssessmentUncheckedCreateNestedManyWithoutVendorInputObjectSchema } from './TechnicalAssessmentUncheckedCreateNestedManyWithoutVendorInput.schema';
import { TechnicalIssueUncheckedCreateNestedManyWithoutVendorInputObjectSchema as TechnicalIssueUncheckedCreateNestedManyWithoutVendorInputObjectSchema } from './TechnicalIssueUncheckedCreateNestedManyWithoutVendorInput.schema'

const makeSchema = () => z.object({
  id: z.string(),
  name: z.string(),
  role: VendorRoleSchema.optional(),
  isAuthorized: z.boolean().optional(),
  email: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  note: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date(),
  bankName: z.string().optional().nullable(),
  bankAcc: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
  Invoice: z.lazy(() => InvoiceUncheckedCreateNestedManyWithoutVendorInputObjectSchema).optional(),
  MaintenanceRecord: z.lazy(() => MaintenanceRecordUncheckedCreateNestedManyWithoutVendorInputObjectSchema).optional(),
  product: z.lazy(() => ProductUncheckedCreateNestedManyWithoutVendorInputObjectSchema).optional(),
  serviceRequest: z.lazy(() => ServiceRequestUncheckedCreateNestedManyWithoutVendorInputObjectSchema).optional(),
  technicalAssessment: z.lazy(() => TechnicalAssessmentUncheckedCreateNestedManyWithoutVendorInputObjectSchema).optional(),
  technicalIssue: z.lazy(() => TechnicalIssueUncheckedCreateNestedManyWithoutVendorInputObjectSchema).optional()
}).strict();
export const VendorUncheckedCreateWithoutAcquisitionInputObjectSchema: z.ZodType<Prisma.VendorUncheckedCreateWithoutAcquisitionInput> = makeSchema() as unknown as z.ZodType<Prisma.VendorUncheckedCreateWithoutAcquisitionInput>;
export const VendorUncheckedCreateWithoutAcquisitionInputObjectZodSchema = makeSchema();
