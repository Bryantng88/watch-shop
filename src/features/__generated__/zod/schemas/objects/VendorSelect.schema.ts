import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionFindManySchema as AcquisitionFindManySchema } from '../findManyAcquisition.schema';
import { InvoiceFindManySchema as InvoiceFindManySchema } from '../findManyInvoice.schema';
import { MaintenanceRecordFindManySchema as MaintenanceRecordFindManySchema } from '../findManyMaintenanceRecord.schema';
import { ProductFindManySchema as ProductFindManySchema } from '../findManyProduct.schema';
import { ServiceRequestFindManySchema as ServiceRequestFindManySchema } from '../findManyServiceRequest.schema';
import { TechnicalAssessmentFindManySchema as TechnicalAssessmentFindManySchema } from '../findManyTechnicalAssessment.schema';
import { TechnicalIssueFindManySchema as TechnicalIssueFindManySchema } from '../findManyTechnicalIssue.schema';
import { BankArgsObjectSchema as BankArgsObjectSchema } from './BankArgs.schema';
import { VendorCountOutputTypeArgsObjectSchema as VendorCountOutputTypeArgsObjectSchema } from './VendorCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  role: z.boolean().optional(),
  isAuthorized: z.boolean().optional(),
  email: z.boolean().optional(),
  phone: z.boolean().optional(),
  address: z.boolean().optional(),
  note: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  bankName: z.boolean().optional(),
  bankAcc: z.boolean().optional(),
  isActive: z.boolean().optional(),
  Acquisition: z.union([z.boolean(), z.lazy(() => AcquisitionFindManySchema)]).optional(),
  Invoice: z.union([z.boolean(), z.lazy(() => InvoiceFindManySchema)]).optional(),
  MaintenanceRecord: z.union([z.boolean(), z.lazy(() => MaintenanceRecordFindManySchema)]).optional(),
  product: z.union([z.boolean(), z.lazy(() => ProductFindManySchema)]).optional(),
  serviceRequest: z.union([z.boolean(), z.lazy(() => ServiceRequestFindManySchema)]).optional(),
  technicalAssessment: z.union([z.boolean(), z.lazy(() => TechnicalAssessmentFindManySchema)]).optional(),
  technicalIssue: z.union([z.boolean(), z.lazy(() => TechnicalIssueFindManySchema)]).optional(),
  bank: z.union([z.boolean(), z.lazy(() => BankArgsObjectSchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => VendorCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const VendorSelectObjectSchema: z.ZodType<Prisma.VendorSelect> = makeSchema() as unknown as z.ZodType<Prisma.VendorSelect>;
export const VendorSelectObjectZodSchema = makeSchema();
