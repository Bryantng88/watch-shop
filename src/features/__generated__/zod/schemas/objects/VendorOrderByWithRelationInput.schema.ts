import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { AcquisitionOrderByRelationAggregateInputObjectSchema as AcquisitionOrderByRelationAggregateInputObjectSchema } from './AcquisitionOrderByRelationAggregateInput.schema';
import { InvoiceOrderByRelationAggregateInputObjectSchema as InvoiceOrderByRelationAggregateInputObjectSchema } from './InvoiceOrderByRelationAggregateInput.schema';
import { MaintenanceRecordOrderByRelationAggregateInputObjectSchema as MaintenanceRecordOrderByRelationAggregateInputObjectSchema } from './MaintenanceRecordOrderByRelationAggregateInput.schema';
import { ProductOrderByRelationAggregateInputObjectSchema as ProductOrderByRelationAggregateInputObjectSchema } from './ProductOrderByRelationAggregateInput.schema';
import { ServiceRequestOrderByRelationAggregateInputObjectSchema as ServiceRequestOrderByRelationAggregateInputObjectSchema } from './ServiceRequestOrderByRelationAggregateInput.schema';
import { TechnicalAssessmentOrderByRelationAggregateInputObjectSchema as TechnicalAssessmentOrderByRelationAggregateInputObjectSchema } from './TechnicalAssessmentOrderByRelationAggregateInput.schema';
import { TechnicalIssueOrderByRelationAggregateInputObjectSchema as TechnicalIssueOrderByRelationAggregateInputObjectSchema } from './TechnicalIssueOrderByRelationAggregateInput.schema';
import { BankOrderByWithRelationInputObjectSchema as BankOrderByWithRelationInputObjectSchema } from './BankOrderByWithRelationInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  role: SortOrderSchema.optional(),
  isAuthorized: SortOrderSchema.optional(),
  email: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  phone: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  address: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  note: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  bankName: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  bankAcc: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  isActive: SortOrderSchema.optional(),
  Acquisition: z.lazy(() => AcquisitionOrderByRelationAggregateInputObjectSchema).optional(),
  Invoice: z.lazy(() => InvoiceOrderByRelationAggregateInputObjectSchema).optional(),
  MaintenanceRecord: z.lazy(() => MaintenanceRecordOrderByRelationAggregateInputObjectSchema).optional(),
  product: z.lazy(() => ProductOrderByRelationAggregateInputObjectSchema).optional(),
  serviceRequest: z.lazy(() => ServiceRequestOrderByRelationAggregateInputObjectSchema).optional(),
  technicalAssessment: z.lazy(() => TechnicalAssessmentOrderByRelationAggregateInputObjectSchema).optional(),
  technicalIssue: z.lazy(() => TechnicalIssueOrderByRelationAggregateInputObjectSchema).optional(),
  bank: z.lazy(() => BankOrderByWithRelationInputObjectSchema).optional()
}).strict();
export const VendorOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.VendorOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.VendorOrderByWithRelationInput>;
export const VendorOrderByWithRelationInputObjectZodSchema = makeSchema();
