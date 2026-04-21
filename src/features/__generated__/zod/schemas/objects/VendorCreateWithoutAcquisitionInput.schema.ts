import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { VendorRoleSchema } from '../enums/VendorRole.schema';
import { InvoiceCreateNestedManyWithoutVendorInputObjectSchema as InvoiceCreateNestedManyWithoutVendorInputObjectSchema } from './InvoiceCreateNestedManyWithoutVendorInput.schema';
import { MaintenanceRecordCreateNestedManyWithoutVendorInputObjectSchema as MaintenanceRecordCreateNestedManyWithoutVendorInputObjectSchema } from './MaintenanceRecordCreateNestedManyWithoutVendorInput.schema';
import { ProductCreateNestedManyWithoutVendorInputObjectSchema as ProductCreateNestedManyWithoutVendorInputObjectSchema } from './ProductCreateNestedManyWithoutVendorInput.schema';
import { ServiceRequestCreateNestedManyWithoutVendorInputObjectSchema as ServiceRequestCreateNestedManyWithoutVendorInputObjectSchema } from './ServiceRequestCreateNestedManyWithoutVendorInput.schema';
import { TechnicalAssessmentCreateNestedManyWithoutVendorInputObjectSchema as TechnicalAssessmentCreateNestedManyWithoutVendorInputObjectSchema } from './TechnicalAssessmentCreateNestedManyWithoutVendorInput.schema';
import { TechnicalIssueCreateNestedManyWithoutVendorInputObjectSchema as TechnicalIssueCreateNestedManyWithoutVendorInputObjectSchema } from './TechnicalIssueCreateNestedManyWithoutVendorInput.schema';
import { BankCreateNestedOneWithoutVendorInputObjectSchema as BankCreateNestedOneWithoutVendorInputObjectSchema } from './BankCreateNestedOneWithoutVendorInput.schema'

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
  updatedAt: z.coerce.date(),
  bankAcc: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
  Invoice: z.lazy(() => InvoiceCreateNestedManyWithoutVendorInputObjectSchema).optional(),
  MaintenanceRecord: z.lazy(() => MaintenanceRecordCreateNestedManyWithoutVendorInputObjectSchema).optional(),
  product: z.lazy(() => ProductCreateNestedManyWithoutVendorInputObjectSchema).optional(),
  serviceRequest: z.lazy(() => ServiceRequestCreateNestedManyWithoutVendorInputObjectSchema).optional(),
  technicalAssessment: z.lazy(() => TechnicalAssessmentCreateNestedManyWithoutVendorInputObjectSchema).optional(),
  technicalIssue: z.lazy(() => TechnicalIssueCreateNestedManyWithoutVendorInputObjectSchema).optional(),
  bank: z.lazy(() => BankCreateNestedOneWithoutVendorInputObjectSchema).optional()
}).strict();
export const VendorCreateWithoutAcquisitionInputObjectSchema: z.ZodType<Prisma.VendorCreateWithoutAcquisitionInput> = makeSchema() as unknown as z.ZodType<Prisma.VendorCreateWithoutAcquisitionInput>;
export const VendorCreateWithoutAcquisitionInputObjectZodSchema = makeSchema();
